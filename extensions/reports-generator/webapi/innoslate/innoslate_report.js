// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
const https = require('https');
const docx = require('docx');
const sizeOf = require('image-size');
const mime = require('mime-types');


const adapters_path = process.env.ADAPTERS_PATH;
const static_assets_path = process.env.STATIC_ASSETS_PATH;

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Media,
  HeadingLevel,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  PageOrientation,
  Header,
  Footer,
  AlignmentType,
  VerticalAlign,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  TableOfContents,
  TableAnchorType,
  WidthType,
  TableLayoutType,
  OverlapType,
  SectionType
} = docx


class InnoslateReport {
  // This class defines methods and structures to create a report in Word's
  //  .docx format from structured data, specifically a requirements report
  //  from an Innoslate document model
  constructor (reportId, responses, reportType="JSON", host, headers) {
    this.reportId = parseInt(reportId)
    this.responses = responses
    this.reportType = reportType
    this.host = host
    this.headers = headers

    let extStyle = fs.readFileSync(`${static_assets_path}/common/defaultStyles.xml`, "utf-8")
    let marginSize = 720
    if (reportType == "NRIC") {
      extStyle = fs.readFileSync(`${static_assets_path}/NRIC/nricStyles.xml`, "utf-8")
    } else if (reportType == "MFC") {
      extStyle = fs.readFileSync(`${static_assets_path}/MFC/mfcStyles.xml`, "utf-8")
      marginSize = 1440
    }
    this.doc = new Document({
      externalStyles: extStyle
    })

    this.marginSize = marginSize
    this.title = "None"
    this.artifactId = "None"
    this.author = "Anonymous"
    this.authors = []
    this.int_date = "00/00/0000"
    this.string_date = "Month Year"
    this.data = {}
    this.children = []
    this.recursionLimit = 25
    this.headingMap = {
      0: HeadingLevel.HEADING_1,
      1: HeadingLevel.HEADING_1,
      2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3,
      4: HeadingLevel.HEADING_4
    }
    this.compiledIds = []
    this.enclosingTags = ["em", "strong", "u", "del", "sup", "sub"]
    this.requirementId = 0
    this.rationaleId = 0
    this.revisionId = 0
    this.ecrId = 0
    this.tempDir = ""
    this.imageNames = []
    this.imagePromises = []
    this.finalPromise = null
    this.textRuns = []
    this.imgMaxWidth = (12240 - (this.marginSize * 2)) / 15
    this.indentSections = true
    this.revisionNumber = ""
    this.doe_statement = ""
    this.is_ouo = false
    this.ouo_footer_tag = ""
    this.eCRNumber = ""
    this.requirement_prepend = false
    this.heading1_page_break = true
    this.heading1_all_caps = false
    this.heading4_abbreviate = false
    this.center_appendix = false
  }

  createTempDir() {
    // create a temporary directory to hold images before final compilation
    this.tempDir = tmp.dirSync({unsafeCleanup: true})
  }

  getTempDir() {
    return this.tempDir.name
  }

  removeTempDir() {
    // remove temporary directory and its contents
    this.tempDir.removeCallback()
  }

  async downloadImage(addressIn, locationIn) {
    // get an image from an address, and write it to file
    let response = await axios.get(
      addressIn,
      { headers: this.headers, responseType: "stream"}
    )

    let content_type = response.headers['content-type']
    let file_extension = "." + mime.extension(content_type)

    const writer = fs.createWriteStream(locationIn + file_extension)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('error', reject)
      writer.on('finish', resolve)
    })
  }

  getImages() {
    // find and get all images from a string of data. save as array of promises
    let dataAsString = this.data['entities']
    dataAsString = JSON.stringify(dataAsString) // turn entire dataset to string
    let reImage = new RegExp("<img[\\s\\S]*?>", 'g')
    let reQuotes = new RegExp("\"[\\s\\S]*?\"")
    let images = dataAsString.match(reImage) // find all html images

    if (images) {
      for (var i=0; i < images.length; i++) {
        let image = images[i].match(reQuotes)
        image = image[0]
        image = image.replace('\\', '')
        image = image.replace("\"", '')
        image = image.replace("\"", '')

        let address = image
        if (!(image.includes(this.host))) {
          address = this.host + address
        }

        let fileName = image.split('/files/')
        fileName = fileName[1]
        if (fileName.includes("?")) {
          let splitString = fileName.split("?")
          fileName = splitString[0]
        }
        fileName = fileName.replace('/serve', '');

        //let fileLoc = path.join(this.tempDir.name, fileName + ".png")
        let fileLoc = path.join(this.tempDir.name, fileName)
        let tempProm = this.downloadImage(address, fileLoc)
        this.imagePromises.push(tempProm)
      }
    }
  }

  gatherSchemaIds() {
    // get Innoslate schema IDs specifying requirements and rationales
    let requirement_obj = this.data['schema']['classes'].filter(obj => {
      return obj.name == "Requirement"
    })
    requirement_obj = requirement_obj[0]

    let rationale_obj = this.data['schema']['properties'].filter(obj => {
      return obj.name == "Rationale"
    })
    rationale_obj = rationale_obj[0]

    let revision_obj = this.data['schema']['properties'].filter(obj => {
      return obj.name == "Revision Number"
    })
    revision_obj = revision_obj[0]

    let ecr_obj = this.data['schema']['properties'].filter(obj => {
      return obj.name == "eCR Number"
    })
    ecr_obj = ecr_obj[0]

    this.requirementId = requirement_obj.id
    this.rationaleId = rationale_obj.id
    this.revisionId = revision_obj.id
    this.ecrId = ecr_obj.id
  }

  divideAndAnnotate(chunks) {
    // this method takes a single-element array of text with formatting
    //  attributes, and recursively expands the array by splitting array
    //  elements along formatting tags. Each tag encountered replaces the
    //  current element with a new set of elements that capture the overlapping
    //  formatting attributes. The process continues until no more formatting
    //  tags are encountered
    for (var chunk=0; chunk < chunks.length; chunk++) { // loop through each el
      for (var i=0; i < this.enclosingTags.length; i++) { // for standard tags
        let tag = this.enclosingTags[i]
        var re = new RegExp("<" + tag + ">[\\s\\S]*?</" + tag + ">", 'g')
        if (chunks[chunk]["text"].match(re)) { // if fully enclosed tag found
          let openTagLoc = chunks[chunk]["text"].indexOf("<" + tag + ">")

          let pre = chunks[chunk]["text"].slice(0, openTagLoc)
          let tempLast = chunks[chunk]["text"].replace(pre, '')
          tempLast = tempLast.replace("<" + tag + ">", '')

          let closeTagLoc = tempLast.indexOf("</" + tag + ">")

          let mid = tempLast.slice(0, closeTagLoc)
          let post = tempLast.replace(mid, '')
          post = post.replace("</" + tag + ">", '')

          let tempPre = Object.assign({}, chunks[chunk])
          let tempMid = Object.assign({}, chunks[chunk])
          let tempPost = Object.assign({}, chunks[chunk])

          Object.assign(tempPre, {"text": pre})
          Object.assign(tempMid, {"text": mid})
          tempMid[tag] = true
          Object.assign(tempPost, {"text": post})

          chunks.splice(chunk, 1, tempPre, tempMid, tempPost)
          this.divideAndAnnotate(chunks)

        } else if (chunks[chunk]["text"].includes("</" + tag + ">")) { // if only closing tag found

          let closeTagLoc = chunks[chunk]["text"].indexOf("</" + tag + ">")

          let pre = chunks[chunk]["text"].slice(0, closeTagLoc)
          let post = chunks[chunk]["text"].replace(pre, '')
          post = post.replace("</" + tag + ">", '')

          let tempPre = Object.assign({}, chunks[chunk])
          let tempPost = Object.assign({}, chunks[chunk])

          Object.assign(tempPre, {"text": pre})
          tempPre[tag] = true
          Object.assign(tempPost, {"text": post})

          chunks.splice(chunk, 1, tempPre, tempPost)
          this.divideAndAnnotate(chunks)
        } else if (chunks[chunk]["text"].includes("<" + tag + ">")) { // if only leading tag found

          let openTagLoc = chunks[chunk]["text"].indexOf("<" + tag + ">")

          let pre = chunks[chunk]["text"].slice(0, openTagLoc)
          let post = chunks[chunk]["text"].replace(pre, '')
          post = post.replace("<" + tag + ">", '')

          let tempPre = Object.assign({}, chunks[chunk])
          let tempPost = Object.assign({}, chunks[chunk])

          Object.assign(tempPre, {"text": pre})
          Object.assign(tempPost, {"text": post})
          tempPost[tag] = true

          chunks.splice(chunk, 1, tempPre, tempPost)
          this.divideAndAnnotate(chunks)
        }
      }

      var reLink = new RegExp("<a [\\s\\S]*?</a>")
      var reImage = new RegExp("<img[\\s\\S]*?>")

      if (chunks[chunk]["text"].match(reLink)) { // if hyperlink found
        let link = chunks[chunk]["text"].match(reLink)
        link = link[0]

        var reHref = new RegExp("href=\"[\\s\\S]*?\"")
        var reLinkText = new RegExp(">[\\s\\S]*?</a>")

        let href = link.match(reHref)
        href = href[0]
        href = href.replace("href=\"", '')
        href = href.replace("\"", '')

        let linkText = link.match(reLinkText)
        linkText = linkText[0]
        linkText = linkText.replace(">", '')
        linkText = linkText.replace("</a>", '')

        let linkLoc = chunks[chunk]["text"].indexOf(link)

        let pre = chunks[chunk]["text"].slice(0, linkLoc)
        let post = chunks[chunk]["text"].replace(pre, '')
        post = post.replace(link, '')
        let fullLink = href + "|||" + linkText

        let tempPre = Object.assign({}, chunks[chunk])
        let tempLink = Object.assign({}, chunks[chunk])
        let tempPost = Object.assign({}, chunks[chunk])

        Object.assign(tempPre, {"text": pre})
        Object.assign(tempLink, {"text": fullLink})
        tempLink["a"] = true
        Object.assign(tempPost, {"text": post})

        chunks.splice(chunk, 1, tempPre, tempLink, tempPost)
        this.divideAndAnnotate(chunks)
      } else if (chunks[chunk]["text"].match(reImage)) { // if image found

        let image = chunks[chunk]["text"].match(reImage)
        image = image[0]
        var reSrc = new RegExp("src=\"[\\s\\S]*?\"")

        let source = image.match(reSrc)
        source = source[0]
        source = source.replace("src=\"", '')
        source = source.replace("\"", '')

        let imageLoc = chunks[chunk]["text"].indexOf(image)

        let pre = chunks[chunk]["text"].slice(0, imageLoc)
        let post = chunks[chunk]["text"].replace(pre, '')
        post = post.replace(image, '')

        let tempPre = Object.assign({}, chunks[chunk])
        let tempImage = Object.assign({}, chunks[chunk])
        let tempPost = Object.assign({}, chunks[chunk])

        Object.assign(tempPre, {"text": pre})
        Object.assign(tempImage, {"text": source})
        tempImage["img"] = true
        Object.assign(tempPost, {"text": post})

        chunks.splice(chunk, 1, tempPre, tempImage, tempPost)
        this.divideAndAnnotate(chunks)
      }
    }
    return chunks
  }

  makeParagraphElements(stringIn) {
    // take in a string, and convert it to styled TextRuns
    let chunks = [{
      "text": stringIn,
      "strong": false,
      "em": false,
      "u": false,
      "del": false,
      "sup": false,
      "sub": false,
      "a": false,
      "img": false,
    }]

    // recursively divide single-element chunk array into an array of elements
    //  that capture the formatting of each section until all formatting tags
    //  have been accounted for
    chunks = this.divideAndAnnotate(chunks)

    let textRunsOut = []

    for (var i=0; i < chunks.length; i++) {
      let chunk = chunks[i]
      if (chunk['a']) { // handle hyperlink section
        let linkEls = chunk['text'].split("|||")
        let hl = this.doc.createHyperlink(linkEls[0], linkEls[1])
        textRunsOut.push(hl)
      } else if (chunk['img']) { // handle image section

        let image = chunk['text']
        let address = this.host + image
        let fileName = image.split('/files/')
        fileName = fileName[1]
        if (fileName.includes("?")) {
          let splitString = fileName.split("?")
          fileName = splitString[0]
        }
        fileName = fileName.replace('/serve', '');

        let fileLoc = ""

        let files = fs.readdirSync(this.tempDir.name)

        files.forEach( file => {
          if (file.includes(fileName)) {
            fileLoc = file
          }
        })

        let fileLocFull = path.join(this.tempDir.name,  fileLoc)

        let dimensions = sizeOf(fileLocFull)
        let width = dimensions.width
        let height = dimensions.height

        if (width > this.imgMaxWidth) {
          let factor = this.imgMaxWidth / width
          width = factor * width
          height = factor * height
        }

        let tempImg = Media.addImage(
          this.doc, fs.readFileSync(fileLocFull), width, height,
        )

        textRunsOut.push(tempImg)

      } else if (chunk['text'] != '') { // handle all other formatting tags
        let tr = new TextRun({
          text: chunk['text'],
          bold: chunk["strong"],
          italics: chunk["em"],
          underline: chunk["u"],
          strike: chunk["del"],
          superScript: chunk["sup"],
          subScript: chunk["sub"]
        })
        textRunsOut.push(tr)
      }
    }

    return textRunsOut;
  }

  makeParagraphs(stringIn, indent) {
    // detect paragraphs in enclosing <p> tags, or create from untagged text
    let paragraphsOut = []
    let paragraphs = stringIn.match(/<p>[\s\S]*?<\/p>/g);
    if (paragraphs) {
      for (var i=0; i < paragraphs.length; i++) {
        let parString = paragraphs[i].replace('<p>', '')
        parString = parString.replace('</p>', '')
        paragraphsOut.push(
          new Paragraph ({
            children: this.makeParagraphElements(parString),
            spacing: {after: 120},
            indent: {left: indent}
          })
        )
      }
    } else {
      paragraphsOut.push(
        new Paragraph ({
          children:  this.makeParagraphElements(stringIn),
          spacing: {after: 120},
          indent: {left: indent}
        })
      )
    }
    return paragraphsOut
  }

  makeTable(stringIn, indent) {
    // create .docx table from HTML table
    let tempString = stringIn
    let tables = stringIn.match(/<table[\s\S]*?>/g);
    let tableString = tables[0]
    let table = stringIn.replace(tableString, '')
    table = table.replace('</table>', '')
    table = table.replace('<thead>', '')
    table = table.replace('</thead>', '')
    table = table.replace('<tbody>', '')
    table = table.replace('</tbody>', '')
    let rows = table.match(/<tr>[\s\S]*?<\/tr>/g)
    let rowList = []
    if (rows) {
      for (var i=0; i < rows.length; i++) {
        let tempRow = rows[i].replace('<tr>', '')
        tempRow = tempRow.replace('</tr>', '')
        let cells = tempRow.match(/<td>[\s\S]*?<\/td>/g)
        if (tempRow.includes('<th>')) {
          cells = tempRow.match(/<th>[\s\S]*?<\/th>/g)
        }
        let cellList = []
        if (indent > 0) {
          cellList.push(
            new TableCell({
              children: this.makeParagraphs(" "),
              borders: {
                top: { style: BorderStyle.SINGLE},
                bottom: { style: BorderStyle.SINGLE},
                left: { style: BorderStyle.SINGLE},
                right: { style: BorderStyle.SINGLE}
              },
              width: {size: indent, type: WidthType.DXA}
            })
          )
        }
        for (var j=0; j < cells.length; j++) {
          let tempCell = cells[j].replace('<td>', '')
          tempCell = tempCell.replace('</td>', '')
          tempCell = tempCell.replace('<th>', '')
          tempCell = tempCell.replace('</th>', '')
          cellList.push(new TableCell({
            children: this.makeParagraphs(tempCell),
            margins: {top: 50, bottom: 50, left: 50, right: 50},
            borders: {
              top: { style: BorderStyle.SINGLE},
              bottom: { style: BorderStyle.SINGLE},
              left: { style: BorderStyle.SINGLE},
              right: { style: BorderStyle.SINGLE}
            }
          }))
        }
        rowList.push(new TableRow({ children: cellList }))
      }
    }

    if (rowList.length > 0) {
      return new Table ({
        rows: rowList,
        // indent: {left: indent}
        width: {
          size: 12240 - (this.marginSize * 2),
          type: WidthType.DXA
        },
        // float: {
        //   verticalAnchor: TableAnchorType.TEXT,
        //   relativeVerticalPosition: RelativeVerticalPosition.INLINE,
        //   absoluteHorizontalPosition: 720 + indent,
        //   wrap: {type: TextWrappingType.TOP_AND_BOTTOM}
        // }
      })
    }

    return;

  }

  parseHTML(stringIn, indent) {
    // take a string of HTML. replace spaces, ampersands, and line breaks.
    //  replace <figure> tags with <p> tags. loop through tables, and format
    //  them as .docx tables, format the leftover parts as paragraphs
    let childrenOut = []

    // replace [&nbsp;, &amp;, <br>, <figure>, <inno>]
    let initialString = stringIn.replace(/&nbsp;/g, " ")
    initialString = initialString.replace(/&amp;/g, "&")
    initialString = initialString.replace(/<br>/g, "\n")
    initialString = initialString.replace(/<figure>/g, "<p>")
    initialString = initialString.replace(/<\/figure>/g, "</p>")
    initialString = initialString.replace(/<inno(.*?)>/g, "")
    initialString = initialString.replace(/<\/inno>/g, "")

    // handle tables
    let tables = initialString.match(/<table[\s\S]*?<\/table>/g); //find tables

    let tempChildren = []
    if (tables) { // if search != null
      let splitString = []
      for (var i=0; i < tables.length; i++) {
        splitString = initialString.split(tables[i])
        if (splitString[0] != "") {
          tempChildren = this.makeParagraphs(splitString[0], indent)
          for (var j=0; j < tempChildren.length; j++) {
            childrenOut.push(tempChildren[j])
          }
        }
        tempChildren = [ this.makeTable(tables[i], indent) ]
        childrenOut.push(tempChildren[0])
        }
        initialString = splitString[1]
      }


    if (initialString != "") {
      tempChildren = this.makeParagraphs(initialString, indent)
      for (var i=0; i < tempChildren.length; i++) {
        childrenOut.push(tempChildren[i])
      }
    }

    return childrenOut;
  }

  relSort(rels) {
    // include sortNumber in rels, sort rels object by it
    let sortedRels = []
    let temp_obj = {}
    for (var i=0; i < rels.length; i++) {
      let ident = parseInt(rels[i]['targetId'])
      temp_obj = this.data['entities'].filter(obj => {
        return obj.id === ident; // return entity w matching ID
      })
      temp_obj = temp_obj[0]
      if (temp_obj) { // make a new rels entry with sortNumber included
        sortedRels[i] = {}
        sortedRels[i]['relationId'] = rels[i]['relationId']
        sortedRels[i]['targetId'] = rels[i]['targetId']
        sortedRels[i]['sortNumber'] = temp_obj['sortNumber']
      } else {
        sortedRels[i] = {}
        sortedRels[i]['relationId'] = rels[i]['relationId']
        sortedRels[i]['targetId'] = rels[i]['targetId']
        sortedRels[i]['sortNumber'] = ''
      }
    }
    sortedRels.sort((a, b) => (a.sortNumber < b.sortNumber) ? -1 : 1) // sort
    return sortedRels
  }

  recurseCompile(ident, recursionCounter) {
    // will append Paragraphs and Tables to this.children
    this.compiledIds.push(ident) // record entity so it's only printed once.

    try { // capture entire recursion iteration in try/catch
      if (recursionCounter < this.recursionLimit) { // check against recur lim
        let temp_obj = this.data['entities'].filter(obj => {
          return obj.id === ident; // return entity w matching ID
        })
        temp_obj = temp_obj[0] // extract data from single-entry array

        if (temp_obj) { // if entity is not undefined, continue
          let tmp_number = ""
          if(temp_obj['number']) {
            tmp_number = temp_obj['number']
          }
          let tmp_name = ""
          if (temp_obj['name']) {
            tmp_name = temp_obj['name']
          }
          let tmp_description_list = [] // create placeholder description

          let desc = ""

          if (temp_obj['description']) { // if description exists, replace
            desc = temp_obj["description"]
            if (temp_obj['classId'] == this.requirementId && this.requirement_prepend) {
              if (desc.includes("<p>")) {
                desc = desc.replace('<p>', '<p><strong>[REQ ID# ' + temp_obj['id'] + ']</strong>    ')
              } else {
                desc = "<strong>[REQ ID# " + temp_obj['id'] + "]</strong>    " + desc
              }
            }
          }
          if ('attrs' in temp_obj) {
            if (this.rationaleId.toString() in temp_obj['attrs']) {
              if (temp_obj['attrs'][this.rationaleId.toString()] != "" && this.requirement_prepend) {
                desc += "<p><strong>Rationale</strong>: " +
                  temp_obj['attrs'][this.rationaleId.toString()] +
                  "</p>"
              }
            }

            if (this.revisionId.toString() in temp_obj['attrs']) {
              if (temp_obj['attrs'][this.revisionId.toString()] != "") {
                this.revisionNumber = temp_obj['attrs'][this.revisionId.toString()]
              }
            }

            if (this.ecrId.toString() in temp_obj['attrs']) {
              if (temp_obj['attrs'][this.ecrId.toString()] != "") {
                this.eCRNumber = temp_obj['attrs'][this.ecrId.toString()]
              }
            }
          }

          // match heading level styling based on recursion level
          let heading = HeadingLevel.HEADING_5
          let indent = (5 - 1) * 360
          if (recursionCounter < 5) {
            heading = this.headingMap[recursionCounter]
            if (this.indentSections) {
              indent = (recursionCounter - 1) * 360
            } else {
              indent = 0
            }
          }

          let pageBreak = false
          let padding = 120
          let allCaps = false
          let heading_alignment = null

          if (recursionCounter == 1) {
            pageBreak = this.heading1_page_break
            padding = 240
            allCaps = this.heading1_all_caps
            if (tmp_name.substring(0, 8) == "Appendix") {
              tmp_number = ''
              if (this.center_appendix) {
                heading_alignment = AlignmentType.CENTER
                pageBreak = true
              }
            }
          } else if (recursionCounter == 2) {
            padding=240
          } else if (recursionCounter == 4 && this.heading4_abbreviate) {
            tmp_number = tmp_number.substr(tmp_number.lastIndexOf(".") + 1)
          }

          tmp_description_list = this.parseHTML(desc, indent)

          // create heading from entity number and name
          if (ident != this.reportId) { // normal entities are printed as heading and paragraphs

            this.children.push(
              new Paragraph ({
                heading: heading,
                children: [ new TextRun({
                  text: tmp_number + "    " + tmp_name,
                  allCaps: allCaps
                })],
                spacing: {before: padding, after: padding},
                pageBreakBefore: pageBreak,
                indent: {left: indent},
                alignment: heading_alignment
              })
            )

            // add paragraphs and tables from description
            for (var i=0; i < tmp_description_list.length; i++) {
              this.children.push(
                tmp_description_list[i]
              )
            }
          } else { // report root entity has different info extracted
            // set title and artifactId
            this.title = tmp_name
            this.artifactId = tmp_number

            //set authors
            this.author = this.data['user'].displayName.name
            if (this.author.includes("|")) {
              this.authors = this.author.split("|")
            } else {
              this.authors = [this.author]
            }

            //set OUO
            this.is_ouo = (this.data['user'].displayName.isOUO == 'true')

            //set date
            const month_names = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            var d = new Date()

            let month = d.getMonth() + 1
            let month_name = month_names[d.getMonth()]
            let day = d.getDate()
            let year = d.getFullYear()
            this.int_date = month + "/" + day + "/" + year
            this.string_date = month_name + " " + year
          }


          if (temp_obj['rels']) { // if entity contains a list of rels, recur through
            let sortedRels = this.relSort(temp_obj['rels']) // sort rels by sortNumber
            for (var i=0; i < sortedRels.length; i++) {
              if (sortedRels[i]) {
                if (this.compiledIds.includes(sortedRels[i]['targetId'])) {
                  continue; // if entity has already been recorded, skip
                } else {
                  // recur on entity in rels
                  this.recurseCompile(sortedRels[i]['targetId'], recursionCounter + 1);
                }
              } else {
                console.error(ident + " does not have a SORTED rels object")
                return;
              }
            }
          } else {
            console.error(ident + " does not have a rels object")
            return;
          }
          return;
        } else {
          //console.error(ident + " is not defined. Moving on...")
          return;
        }
      } else {
        console.error("Recursion limit reached on " + ident)
        return;
      }
    } catch(error) {
      console.error(error)
      return;
    }
    return;
  }

  jsonReport() {
    // dump data as text to file
    this.doc.addSection({
      children: [
        new Paragraph({
          children: [
            new TextRun(JSON.stringify(this.data))
          ]
        })
      ]
    })
  }

  nricReport() {
    // make cover page, attach header/footer images, make table of contents,
    //  and concatenate report content generated by the recurseCompile() method
    let ouo_table = new Table({ // Artifact table
      width: { size: 4000, type: WidthType.DXA },
      layout: TableLayoutType.FIXED,
      float: {
        verticalAnchor: TableAnchorType.RIGHT_MARGIN,
        absoluteVerticalPosition: 9000,
        absoluteHorizontalPosition: 3750,
        overlap: OverlapType.OVERLAP
      },
      rows: [
        new TableRow({ children: [ new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      size: 24,
                      allCaps: true
                    })
                  ]
                })
              ],
              borders: {
                top: { style: BorderStyle.NIL},
                bottom: { style: BorderStyle.NIL},
                left: { style: BorderStyle.NIL},
                right: { style: BorderStyle.NIL}
              } }) ] }),
 ] })
    if (this.is_ouo) {
      this.ouo_footer_tag = "OFFICIAL USE ONLY"
      ouo_table = new Table({ // Artifact table
        width: { size: 4500, type: WidthType.DXA },
        layout: TableLayoutType.FIXED,
        float: {
          verticalAnchor: TableAnchorType.RIGHT_MARGIN,
          absoluteVerticalPosition: 9000,
          absoluteHorizontalPosition: 3600,
          overlap: OverlapType.OVERLAP
        },
        rows: [
          new TableRow({ children: [ new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: this.ouo_footer_tag,
                        size: 24,
                        bold: true,
                        allCaps: true
                      })
                    ]
                  })
                ],
                borders: {
                  top: { style: BorderStyle.SINGLE},
                  bottom: { style: BorderStyle.NIL},
                  left: { style: BorderStyle.SINGLE},
                  right: { style: BorderStyle.SINGLE}
                },
                margins: {
                  top: 100,
                  bottom: 100,
                  left: 120,
                  right: 120
                }
              }) ] }),
          new TableRow({ children: [ new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "May be exempt from public release under the Freedom of Information Act (5 U.S.C. 552), exemption number and category: ",
                        size: 16
                      }),
                      new TextRun({
                        text: "__________________________________________________.",
                        size: 16
                        //underline: true
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "",
                        size: 16
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Department of Energy review required before public release",
                        size: 16
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "",
                        size: 16
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Name/Org: ",
                        size: 16
                      }),
                      new TextRun({
                        text: "________________________",
                        size: 16,
                        underline: true
                      }),
                      new TextRun({
                        text: " Date: ",
                        size: 16
                      }),
                      new TextRun({
                        text: "____________",
                        size: 16,
                        underline: true
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "",
                        size: 16
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Guidance (if applicable): ",
                        size: 16
                      }),
                      new TextRun({
                        text: "______________________________",
                        size: 16,
                        underline: true
                      })
                    ]
                  })
                ],
                borders: {
                  top: { style: BorderStyle.NIL},
                  bottom: { style: BorderStyle.SINGLE},
                  left: { style: BorderStyle.SINGLE},
                  right: { style: BorderStyle.SINGLE}
                },
                margins: {
                  top: 5,
                  bottom: 100,
                  left: 100,
                  right: 100
                }
               }) ] }) ] })
    }


    const splash = Media.addImage(this.doc,
      fs.readFileSync(`${static_assets_path}/NRIC/title.jpg`),
      //816, 1104, {
      816, 1056, {
        floating: {
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.OUTSIDE_MARGIN,
            offset: 0},
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.TOP_MARGIN,
            offset: -250000},
          behindDocument: true
        }
      }
    )

    const disclaimer = Media.addImage(this.doc,
      fs.readFileSync(`${static_assets_path}/NRIC/disclaimer.jpg`),
      816, 1056, {
        floating: {
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
            offset: 0},
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.TOP_MARGIN,
            offset: -50292},
          behindDocument: true
        }
      }
    )

    const hfImage = Media.addImage(this.doc,
      fs.readFileSync(`${static_assets_path}/NRIC/header.jpg`),
      //820.8, 1062.72, {
      816, 1056, {
        floating: {
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
            offset: 0},
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.TOP_MARGIN,
            offset: -225000},
          behindDocument: true
        }
      }
    )

    const authorRows = []

    this.authors.forEach( author => {
      authorRows.push(
        new TableRow({ children: [ new TableCell({
          children: [
            new Paragraph({
              //heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: author,
                  size: 28,
                  color: "006C94"
                })
              ]
            })
          ],
          borders: {
            top: { style: BorderStyle.NIL},
            bottom: { style: BorderStyle.NIL},
            left: { style: BorderStyle.NIL},
            right: { style: BorderStyle.NIL}
          } }) ] }),
      );
      authorRows.push(
        new TableRow({ children: [ new TableCell({
          children: [
            new Paragraph({
              //heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: "Author info",
                  size: 24,
                })
              ]
            })
          ],
          borders: {
            top: { style: BorderStyle.NIL},
            bottom: { style: BorderStyle.NIL},
            left: { style: BorderStyle.NIL},
            right: { style: BorderStyle.NIL}
          } }) ] })
      );

    })

    // Cover page
    this.doc.addSection({
      size: {width: 12180, height: 15075, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      children: [
        new Paragraph({
          children: [
            splash
          ]
        }),
        new Table({ // Artifact table
          width: { size: 5000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            verticalAnchor: TableAnchorType.RIGHT_MARGIN,
            absoluteVerticalPosition: 300,
            absoluteHorizontalPosition: 5900,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      //heading: HeadingLevel.HEADING_1,
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: this.artifactId,
                          size: 20,
                          color: "006C94",
                          allCaps: true
                        })
                      ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
                  } }) ] }),
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      //heading: HeadingLevel.HEADING_1,
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: "Revision: " + this.revisionNumber,
                          size: 20,
                          color: "006C94"
                        })
                      ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ] }), // end artifact table
        new Table({ // Title table
          width: { size: 7000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            absoluteVerticalPosition: 3600,
            absoluteHorizontalPosition: 3750,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      heading: HeadingLevel.TITLE,
                      //alignment: AlignmentType.LEFT,
                      children: [ new TextRun({
                        text: this.title,
                        size: 72,
                        color: "006C94"
                      }) ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ] }), // end title table
        new Table({ // Date table
          width: { size: 5000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            verticalAnchor: TableAnchorType.MARGIN,
            absoluteVerticalPosition: 5600,
            absoluteHorizontalPosition: 3750,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      //heading: HeadingLevel.HEADING_1,
                      children: [
                        new TextRun({
                          text: this.string_date,
                          size: 24,
                          color: "FFFFFF",
                          allCaps: true
                        })
                      ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ] }), // end date table
        new Table({ // Author table
          width: { size: 6000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            verticalAnchor: TableAnchorType.MARGIN,
            absoluteVerticalPosition: 6500,
            absoluteHorizontalPosition: 3750,
            overlap: OverlapType.OVERLAP
          },
          rows: authorRows
        }), // end author table
        ouo_table,
        new Table({ // DOE table
          width: { size: 5000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            verticalAnchor: TableAnchorType.MARGIN,
            absoluteVerticalPosition: 13200,
            absoluteHorizontalPosition: 3500,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      //heading: HeadingLevel.HEADING_1,
                      children: [
                        new TextRun({
                          text: this.doe_statement,
                          size: 20
                        })
                      ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ] }), // end DOE table

      ]
    })

    // Disclaimer page
    this.doc.addSection({
      size: {width: 12180, height: 15075, orientation: PageOrientation.PORTRAIT},
      // size: {width: 12240, height: 15838, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            disclaimer
          ]
        })]
    })

    // Empty page
    this.doc.addSection({
      size: {width: 12180, height: 15075, orientation: PageOrientation.PORTRAIT},
      // size: {width: 12240, height: 15838, orientation: PageOrientation.PORTRAIT},
      //type: SectionType.NEXT_PAGE,
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      children: [
        new Paragraph({
          //heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Page intentionally left blank",
              italics: true,
              size: 28,
              color: "03BAB4"
            })
          ]
        })
      ]
    })

    // Table of Contents
    this.doc.addSection({
      size: {width: 12180, height: 15075, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Table of Contents",
              bold: true
            })
          ]
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: false,
          headingStyleRange: "1-3"
        })
      ]
    })

    // Subsequent pages
    this.doc.addSection({
      size: {width: 12180, height: 15075, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph(hfImage),
            new Table({
              width: { size: 12180 - (this.marginSize * 2), type: WidthType.DXA },
              layout: TableLayoutType.FIXED,
              float: {
                //verticalAnchor: TableAnchorType.TOP_MARGIN,
                absoluteVerticalPosition: -475,
                overlap: OverlapType.OVERLAP
              },
              rows: [
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: this.title,
                              color: "7F7F7F",
                              size: 22
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      } }) ] }) ] }) // end title table
          ] // end header children
        }) // end header
      }, // end headers list
      footers: {
        default: new Footer({
          children: [
            new Table({
              width: { size: 12180 - (this.marginSize * 2), type: WidthType.DXA},
              layout: TableLayoutType.FIXED,
              float: {
                verticalAnchor: TableAnchorType.MARGIN,
                absoluteVerticalPosition: 13900,
                overlap: OverlapType.OVERLAP
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: this.artifactId,
                              color: "FFFFFF",
                              size: 22
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: this.ouo_footer_tag,
                              color: "FFFFFF",
                              size: 22
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              children: [
                                PageNumber.CURRENT
                              ],
                              color: "FFFFFF",
                              size: 22
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL} } }), ] }) ]
            }) // end table
          ] // end footer children
        }) // end footer
      }, // end footers list
      children: [
      ].concat(this.children) // add content defined by this.recurseCompile()
    })
  }

  mfcReport() {
    // make cover page, attach header/footer images, make table of contents,
    //  and concatenate report content generated by the recurseCompile() method

    const logo = Media.addImage(this.doc,
      fs.readFileSync(`${static_assets_path}/MFC/INLlogo.png`),
      196.231, 176.443, {
        floating: {
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.PAGE,
            offset: 330200
          },
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.PAGE,
            // align: VerticalPositionAlign.BOTTOM
            offset: 7169700
          }
        }
      }
    )

    const authorRows = [];

    this.authors.forEach( author => {
      authorRows.push(
        new TableRow({ children: [ new TableCell({
          children: [
            new Paragraph({
              //heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: author,
                  size: 32
                })
              ]
            })
          ],
          borders: {
            top: { style: BorderStyle.NIL},
            bottom: { style: BorderStyle.NIL},
            left: { style: BorderStyle.NIL},
            right: { style: BorderStyle.NIL}
          } }) ] }),
      );
    });

    // Cover page
    this.doc.addSection({
      size: {width: 12240, height: 15838, orientation: PageOrientation.PORTRAIT},
      margins: {top: 720, right: 576, bottom: 3024, left: 4824},
      children: [
        new Paragraph({
          children: [
            logo
          ]
        }),
        new Table({ // Document ID, Revision, Date
          width: { size: 4000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            horizontalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 7500,
            verticalAnchor: TableAnchorType.PAGE,
            absoluteVerticalPosition: 1000,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      children: [ new TextRun({
                        text: "Document ID: " + this.artifactId,
                        font: "Calibri",
                        size: 20
                      }) ],
                      alignment: AlignmentType.RIGHT
                    }),
                    new Paragraph({
                      children: [ new TextRun({
                        text: "Revision ID: " + this.revisionNumber,
                        font: "Calibri",
                        size: 20
                      }) ],
                      alignment: AlignmentType.RIGHT
                    }),
                    new Paragraph({
                      children: [ new TextRun({
                        children: ["Effective Date: ", this.int_date],
                        font: "Arial",
                        size: 20
                      }) ],
                      alignment: AlignmentType.RIGHT
                    }),
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
            } }) ] }) ]
        }), // end doc id table
        new Table({ // Cover heading
          width: { size: 7000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            //horizontalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 0,
            //verticalAnchor: TableAnchorType.PAGE,
            absoluteVerticalPosition: 4000,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      children: [ new TextRun({
                        text: "Functional and Operational Requirements",
                        font: "Arial",
                        size: 40
                      }) ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ] }), // end cover heading table
        new Table({ // Cover title
          width: { size: 7000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            //horizontalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 0,
            //verticalAnchor: TableAnchorType.PAGE,
            absoluteVerticalPosition: 6500,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      children: [ new TextRun({
                        text: this.title,
                        font: "Arial",
                        size: 60
                      }) ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ] }), // end cover title table
        new Table({ // Cover authors
          width: { size: 7000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            //horizontalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 0,
            //verticalAnchor: TableAnchorType.PAGE,
            absoluteVerticalPosition: 9500,
            overlap: OverlapType.OVERLAP
          },
          rows: authorRows
        }), // end cover author table
        new Table({ // Cover DOE
          width: { size: 3000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            //horizontalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 0,
            //verticalAnchor: TableAnchorType.PAGE,
            absoluteVerticalPosition: 11500,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      children: [ new TextRun({
                        text: this.doe_statement,
                        font: "Arial",
                        size: 20
                      }) ]
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
        } }) ] }) ]}), // end cover DOE table
      ]
    })

    // Blank page
    this.doc.addSection({
      size: {width: 12240, height: 15838, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      headers: {
        default: new Header({
          children: [
            new Table({
              width: { size: 12240 - (this.marginSize * 2), type: WidthType.DXA },
              layout: TableLayoutType.FIXED,
              float: {
                verticalAnchor: TableAnchorType.MARGIN,
                absoluteVerticalPosition: -240,
                overlap: OverlapType.OVERLAP
              },
              rows: [
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: " Idaho National Laboratory",
                              size: 20,
                              bold: true
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      },
                      columnSpan: 2
                    }) ] }),
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: this.title,
                              bold: true,
                              allCaps: true
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                      children: [
                        new Table({
                          width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Identifier: ",
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.artifactId,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  columnSpan: 2,
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                })
                              ]
                            }),
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Revision: ",
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 10,
                                    right: 50,
                                    bottom: 10,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.revisionNumber,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  columnSpan: 2,
                                  margins: {
                                    top: 10,
                                    right: 50,
                                    bottom: 10,
                                    left: 50
                                  }
                                })
                              ]
                            }),
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Effective Date: ",
                                          size: 22
                                        })
                                      ]

                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.int_date,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.RIGHT,
                                      children: [
                                        new TextRun({
                                          children: [
                                            "Page: ",
                                            PageNumber.CURRENT,
                                            " of "
                                          ],
                                          size: 22
                                        }),
                                        new TextRun({
                                          children: [
                                            PageNumber.TOTAL_PAGES
                                          ],
                                          size: 22,
                                          bold: true
                                        }),
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                              ]
                            })
                          ]
                        })
                      ],
                    })
                  ] }) ] }), // end title table
          ] // end header children
        }) // end header
      }, // end headers list
      children: [
        new Table({
          width: { size: 12240, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            horizontalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 0,
            verticalAnchor: TableAnchorType.PAGE,
            absoluteVerticalPosition: 7500,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      children: [ new TextRun({
                        text: "Intentionally blank",
                        size: 24,
                        allCaps: true
                      }) ],
                      alignment: AlignmentType.CENTER
                    })

                  ],
                  borders: {
                    top: { style: BorderStyle.NIL},
                    bottom: { style: BorderStyle.NIL},
                    left: { style: BorderStyle.NIL},
                    right: { style: BorderStyle.NIL}
            } }) ] }) ]
        })

      ]
    })

    // Table of Contents
    this.doc.addSection({
      size: {width: 12240, height: 15838, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      headers: {
        default: new Header({
          children: [
            new Table({
              width: { size: 12240 - (this.marginSize * 2), type: WidthType.DXA },
              layout: TableLayoutType.FIXED,
              float: {
                verticalAnchor: TableAnchorType.MARGIN,
                absoluteVerticalPosition: -240,
                overlap: OverlapType.OVERLAP
              },
              rows: [
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: " Idaho National Laboratory",
                              size: 20,
                              bold: true
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      },
                      columnSpan: 2
                    }) ] }),
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: this.title,
                              bold: true,
                              allCaps: true
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                      children: [
                        new Table({
                          width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Identifier: ",
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.artifactId,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  columnSpan: 2,
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                })
                              ]
                            }),
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Revision: ",
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 10,
                                    right: 50,
                                    bottom: 10,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.revisionNumber,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  columnSpan: 2,
                                  margins: {
                                    top: 10,
                                    right: 50,
                                    bottom: 10,
                                    left: 50
                                  }
                                })
                              ]
                            }),
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Effective Date: ",
                                          size: 22
                                        })
                                      ]

                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.int_date,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.RIGHT,
                                      children: [
                                        new TextRun({
                                          children: [
                                            "Page: ",
                                            PageNumber.CURRENT,
                                            " of "
                                          ],
                                          size: 22
                                        }),
                                        new TextRun({
                                          children: [
                                            PageNumber.TOTAL_PAGES
                                          ],
                                          size: 22,
                                          bold: true
                                        }),
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                              ]
                            })
                          ]
                        })
                      ],
                    })
            ] }) ] }), // end title table
          ] // end header children
        }) // end header
      }, // end headers list
      children: [
        new Table({
          width: { size: 12240 - (this.marginSize * 2), type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            verticalAnchor: TableAnchorType.MARGIN,
            absoluteVerticalPosition: -230,
            overlap: OverlapType.NEVER
          },
          rows: [
            new TableRow({ children: [ new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "",
                      size: 20,
                      bold: true
                    })
                  ]
                })
              ],
              borders: {
                top: { style: BorderStyle.NIL},
                bottom: { style: BorderStyle.NIL},
                left: { style: BorderStyle.NIL},
                right: { style: BorderStyle.NIL}
              },
              columnSpan: 3
            }) ] }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: ((12240 - (this.marginSize * 2)) / 3) - 500, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Materials and Fuels Complex",
                          size: 20
                        })
                      ],
                      alignment: AlignmentType.LEFT
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                  width: { size: ((12240 - (this.marginSize * 2)) / 3) + 500, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Functional and Operational Requirements",
                          size: 20
                        })
                      ],
                      alignment: AlignmentType.LEFT
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                  width: { size: (12240 - (this.marginSize * 2)) / 3, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `eCR Number: ${this.eCRNumber}`,
                          size: 20
                        })
                      ],
                      alignment: AlignmentType.LEFT
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                })
              ]
            }),
            new TableRow({ children: [ new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Manual: Stand Alone",
                      size: 20
                    })
                  ]
                })
              ],
              borders: {
                top: { style: BorderStyle.NIL},
                bottom: { style: BorderStyle.NIL},
                left: { style: BorderStyle.NIL},
                right: { style: BorderStyle.NIL}
              },
              columnSpan: 3
            }) ] }),
            new TableRow({ children: [ new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "",
                      size: 20
                    })
                  ]
                })
              ],
              borders: {
                top: { style: BorderStyle.NIL},
                bottom: { style: BorderStyle.NIL},
                left: { style: BorderStyle.NIL},
                right: { style: BorderStyle.NIL}
              },
              columnSpan: 3
            }) ] }),

         ] }), // end title table
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "CONTENTS",
              bold: true
            })
          ]
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: false,
          headingStyleRange: "1-3"
        })
      ]
    })

    // Subsequent pages
    this.doc.addSection({
      size: {width: 12240, height: 15838, orientation: PageOrientation.PORTRAIT},
      margins: {
        top: this.marginSize,
        right: this.marginSize,
        bottom: this.marginSize,
        left: this.marginSize
      },
      headers: {
        default: new Header({
          children: [
            new Table({
              width: { size: 12240 - (this.marginSize * 2), type: WidthType.DXA },
              layout: TableLayoutType.FIXED,
              float: {
                verticalAnchor: TableAnchorType.MARGIN,
                absoluteVerticalPosition: -240,
                overlap: OverlapType.OVERLAP
              },
              rows: [
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Idaho National Laboratory",
                              size: 20,
                              bold: true
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      },
                      columnSpan: 2
                    }) ] }),
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: this.title,
                              bold: true,
                              allCaps: true
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                      children: [
                        new Table({
                          width: { size: (12240 - (this.marginSize * 2)) / 2, type: WidthType.DXA },
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Identifier: ",
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.artifactId,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  columnSpan: 2,
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                })
                              ]
                            }),
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Revision: ",
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 10,
                                    right: 50,
                                    bottom: 10,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.revisionNumber,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  columnSpan: 2,
                                  margins: {
                                    top: 10,
                                    right: 50,
                                    bottom: 10,
                                    left: 50
                                  }
                                })
                              ]
                            }),
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Effective Date: ",
                                          size: 22
                                        })
                                      ]

                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: this.int_date,
                                          size: 22
                                        })
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.RIGHT,
                                      children: [
                                        new TextRun({
                                          children: [
                                            "Page: ",
                                            PageNumber.CURRENT,
                                            " of "
                                          ],
                                          size: 22
                                        }),
                                        new TextRun({
                                          children: [
                                            PageNumber.TOTAL_PAGES
                                          ],
                                          size: 22,
                                          bold: true
                                        }),
                                      ]
                                    })
                                  ],
                                  borders: {
                                    top: { style: BorderStyle.NIL},
                                    bottom: { style: BorderStyle.NIL},
                                    left: { style: BorderStyle.NIL},
                                    right: { style: BorderStyle.NIL}
                                  },
                                  margins: {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                  }
                                }),
                              ]
                            })
                          ]
                        })
                      ],
                    })
                  ] }),
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: " ",
                              size: 120,
                              bold: true
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      },
                      columnSpan: 2
                    }) ] }),
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: " ",
                              size: 120,
                              bold: true
                            })
                          ]
                        })
                      ],
                      borders: {
                        top: { style: BorderStyle.NIL},
                        bottom: { style: BorderStyle.NIL},
                        left: { style: BorderStyle.NIL},
                        right: { style: BorderStyle.NIL}
                      },
                      columnSpan: 2
                    }) ] })
              ] }) // end title table
          ] // end header children
        }) // end header
      }, // end headers list
      children: [

      ].concat(this.children) // add content defined by this.recurseCompile()
    })
  }

  writeReport() {
    // write the report to file and return a promise on the write status
    Packer.toBuffer(this.doc).then((buffer) => {
      console.log(path.join(this.tempDir.name, "report.docx"))
      fs.writeFileSync(path.join(this.tempDir.name, "report.docx"), buffer)
    })
  }

  async makeReport(user, isOUO) {
    // if JSON report, dump text to file. if REQ report, create temp directory,
    //  get images, wait for images to download, the compile report and write to
    //  file

    axios.all(this.responses['data']).then(axios.spread((...responses) => {

      for(var i=0; i<this.responses['keys'].length; i++) {
        responses[0].data.displayName = user;
        responses[0].data.isOUO = isOUO;
        this.data[this.responses['keys'][i]] = responses[i].data
      }

      this.doe_statement = `The INL is a U.S. Department of Energy National Laboratory operated by Battelle Energy Alliance.`

      try {
        if (this.reportType=="JSON") {
          this.jsonReport()
          this.writeReport()
        } else if (this.reportType=="NRIC" || this.reportType=="MFC") {
          this.getImages()
          this.gatherSchemaIds()

          axios.all(this.imagePromises).then(() => {

            if (this.reportType=="NRIC") {
              this.indentSections = false
              this.requirement_prepend = true
              this.heading1_page_break = true
              this.heading1_all_caps = false
              this.heading4_abbreviate = false
              this.center_appendix = false
              this.recurseCompile(this.reportId, 0)
              this.nricReport()
              this.writeReport()
            } else {
              this.indentSections = true
              this.requirement_prepend = false
              this.heading1_page_break = false
              this.heading1_all_caps = true
              this.heading4_abbreviate = true
              this.center_appendix = true
              this.recurseCompile(this.reportId, 0)
              this.mfcReport()
              this.writeReport()
            }
            //this.writeReport()
          }).catch(error => {
            console.error(error)
          })
        } else {
          this.jsonReport()
          this.writeReport()
          console.error(`Could not find report type: ${this.reportType}`)
        }
      } catch(error) {
        this.removeTempDir()
        console.error(`Could not make report: ${error}`)
        return error
      }

    })).catch(error => {
      this.removeTempDir()
      console.error(`Could not grab multiple requests: ${error}`)
      return error
    })

    return this.reportType
  }
}

module.exports = InnoslateReport;
