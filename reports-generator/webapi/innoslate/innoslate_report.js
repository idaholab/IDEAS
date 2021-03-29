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
  OverlapType
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
    this.date = "00/00/0000"
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
    this.tempDir = ""
    this.imageNames = []
    this.imagePromises = []
    this.finalPromise = null
    this.textRuns = []
    this.imgMaxWidth = (12240 - (this.marginSize * 2)) / 15
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

    this.requirementId = requirement_obj.id
    this.rationaleId = rationale_obj.id
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
    let table = stringIn.replace('<table>', '')
    table = table.replace('</table>', '')
    table = table.replace('<tbody>', '')
    table = table.replace('</tbody>', '')
    let rows = table.match(/<tr>[\s\S]*?<\/tr>/g)
    let rowList = []
    if (rows) {
      for (var i=0; i < rows.length; i++) {
        let tempRow = rows[i].replace('<tr>', '')
        tempRow = tempRow.replace('</tr>', '')
        let cells = tempRow.match(/<td>[\s\S]*?<\/td>/g)
        let cellList = []
        if (indent > 0) {
          cellList.push(
            new TableCell({
              children: this.makeParagraphs(" "),
              borders: {
                top: { style: BorderStyle.NIL},
                bottom: { style: BorderStyle.NIL},
                left: { style: BorderStyle.NIL},
                right: { style: BorderStyle.NIL}
              },
              width: {size: indent, type: WidthType.DXA}
            })
          )
        }
        for (var j=0; j < cells.length; j++) {
          let tempCell = cells[j].replace('<td>', '')
          tempCell = tempCell.replace('</td>', '')
          cellList.push(new TableCell({
            children: this.makeParagraphs(tempCell),
            margins: {top: 50, bottom: 50, left: 50, right: 50},
            borders: {
              top: { style: BorderStyle.NIL},
              bottom: { style: BorderStyle.NIL},
              left: { style: BorderStyle.NIL},
              right: { style: BorderStyle.NIL}
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
    let tables = initialString.match(/<table>[\s\S]*?<\/table>/g); //find tables

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
            if (temp_obj['classId'] == this.requirementId) {
              if (desc.includes("<p>")) {
                desc = desc.replace('<p>', '<p><strong>Requirement</strong>: ')
              } else {
                desc = "<strong>Requirement</strong>: " + desc
              }
            }
          }
          if ('attrs' in temp_obj) {
            if (this.rationaleId.toString() in temp_obj['attrs']) {
              if (temp_obj['attrs'][this.rationaleId.toString()] != "") {
                desc += "<p><strong>Rationale</strong>: " +
                  temp_obj['attrs'][this.rationaleId.toString()] +
                  "</p>"
              }
            }
          }

          // match heading level styling based on recursion level
          let heading = HeadingLevel.HEADING_5
          let indent = (5 - 1) * 360
          if (recursionCounter < 5) {
            heading = this.headingMap[recursionCounter]
            indent = (recursionCounter - 1) * 360
          }

          let pageBreak = false
          let padding = 120
          if (recursionCounter == 1) {
            pageBreak = true
            padding = 240
          } else if (recursionCounter == 2) {
            padding=240
          }

          tmp_description_list = this.parseHTML(desc, indent)



          // create heading from entity number and name
          if (ident != this.reportId) { // normal entities are printed as heading and paragraphs
            this.children.push(
              new Paragraph ({
                heading: heading,
                children: [ new TextRun({text: tmp_number + " " + tmp_name})],
                spacing: {before: padding, after: padding},
                pageBreakBefore: pageBreak,
                indent: {left: indent}
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

            //set author
            this.author = this.data['user'].displayName.name

            //set date

            const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            var d = new Date()
            let month = monthNames[d.getMonth()]
            //let day = d.getDate()
            let year = d.getFullYear()
            this.date = month + " " + year
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
      816, 1000, {
        floating: {
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
            offset: 0},
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.TOP_MARGIN,
            offset: 340800},
          behindDocument: true
        }
      }
    )

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
        new Table({ // Floating table for placing document title
          width: { size: 6000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            //verticalAnchor: TableAnchorType.MARGIN,
            absoluteVerticalPosition: 4400,
            absoluteHorizontalPosition: 3000,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      heading: HeadingLevel.TITLE,
                      children: [ new TextRun({
                        text: this.title,
                        size: 40,
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
          width: { size: 6000, type: WidthType.DXA },
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
                          text: this.date,
                          size: 26,
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
        new Table({ // Artifact table
          width: { size: 1000, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          float: {
            verticalAnchor: TableAnchorType.RIGHT_MARGIN,
            absoluteVerticalPosition: 1000,
            absoluteHorizontalPosition: 8000,
            overlap: OverlapType.OVERLAP
          },
          rows: [
            new TableRow({ children: [ new TableCell({
                  children: [
                    new Paragraph({
                      //heading: HeadingLevel.HEADING_1,
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
                  } }) ] }) ] }) // end date table
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
            new Paragraph(hfImage),
            new Table({
              width: { size: 12240 - (this.marginSize * 2), type: WidthType.DXA },
              layout: TableLayoutType.FIXED,
              float: {
                verticalAnchor: TableAnchorType.MARGIN,
                absoluteVerticalPosition: -480,
                overlap: OverlapType.OVERLAP
              },
              rows: [
                new TableRow({ children: [ new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: this.title
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
              width: { size: 12240 - (this.marginSize * 2), type: WidthType.DXA},
              layout: TableLayoutType.FIXED,
              float: {
                verticalAnchor: TableAnchorType.MARGIN,
                absoluteVerticalPosition: 14360,
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
                              text: this.author
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
                              text: this.artifactId
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
                              children: [ this.date, "\t\t", PageNumber.CURRENT]
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
        new Paragraph({
          children: []
        }),
        new Table({ // Floating table for placing document title
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
                        text: "Document ID: FOR-XXXX ",
                        font: "Calibri",
                        size: 20
                      }) ],
                      alignment: AlignmentType.RIGHT
                    }),
                    new Paragraph({
                      children: [ new TextRun({
                        text: "Revision ID: X (DRAFT)",
                        font: "Calibri",
                        size: 20
                      }) ],
                      alignment: AlignmentType.RIGHT
                    }),
                    new Paragraph({
                      children: [ new TextRun({
                        children: ["Effective Date: ", this.date],
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
                  } }) ] }) ] }), // end title table
        // new Table({ // Floating table for placing author and document info
        //   width: { size: 8500, type: WidthType.DXA },
        //   layout: TableLayoutType.FIXED,
        //   float: {
        //     verticalAnchor: TableAnchorType.MARGIN,
        //     absoluteVerticalPosition: 6500,
        //     overlap: OverlapType.OVERLAP
        //   },
        //   rows: [
        //     new TableRow({ children: [ new TableCell({
        //           children: [
        //             new Paragraph({
        //               //heading: HeadingLevel.HEADING_1,
        //               children: [
        //                 new TextRun({
        //                   text: this.author,
        //                   size: 48
        //                 })
        //               ],
        //               spacing: {after: 240},
        //             }),
        //             new Paragraph({
        //               //heading: HeadingLevel.HEADING_3,
        //               children: [
        //                 new TextRun({
        //                   text: "National Reactor Innovation Center | " + this.artifactId + " | " + this.date,
        //                   size: 36
        //                 })
        //               ]
        //             })
        //           ],
        //           borders: {
        //             top: { style: BorderStyle.NIL},
        //             bottom: { style: BorderStyle.NIL},
        //             left: { style: BorderStyle.NIL},
        //             right: { style: BorderStyle.NIL}
        //           } }) ] }) ] }) // end author table
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
                                          text: "X (DRAFT)",
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
                                          text: this.date,
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
                   ] }) ] }) // end title table
          ] // end header children
        }) // end header
      }, // end headers list
      children: [
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
                                          text: "X (DRAFT)",
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
                                          text: "XX/XX/XX",
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
                   ] }) ] }) // end title table
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

  async makeReport(user) {
    // if JSON report, dump text to file. if REQ report, create temp directory,
    //  get images, wait for images to download, the compile report and write to
    //  file

    axios.all(this.responses['data']).then(axios.spread((...responses) => {

      for(var i=0; i<this.responses['keys'].length; i++) {
        responses[0].data.displayName = user;
        this.data[this.responses['keys'][i]] = responses[i].data
      }


      try {
        if (this.reportType=="JSON") {
          this.jsonReport()
          this.writeReport()
        } else if (this.reportType=="NRIC" || this.reportType=="MFC") {
          this.getImages()
          this.gatherSchemaIds()

          axios.all(this.imagePromises).then(() => {
            this.recurseCompile(this.reportId, 0)
            if (this.reportType=="NRIC") {
              this.nricReport()
              this.writeReport()
            } else {
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
