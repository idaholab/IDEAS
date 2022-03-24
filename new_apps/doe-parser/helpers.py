from docx import Document
from docx2python import docx2python
from docx2python.iterators import iter_paragraphs, enum_paragraphs, enum_cells

import csv, re ,os

def save_csv(rows,file_name):
    with open(file_name+'.csv', 'w', newline='',encoding="utf-8") as f:
        write = csv.writer(f)
        for row in rows:
            write.writerow(row)

def parse_paragraph(paragraph):
    rows=[]
    attr=[] #Custom attribute (list ,table, etc)
    key_words={'shall':'','should':'','may':'','must':''}
    key_words = key_words.fromkeys(key_words, '') #Reset values form the previous sentence
    for key_word in key_words.keys():
        if key_word in paragraph:
            key_words[key_word]='x'
    return list(key_words.values())


def split_paragraphs(paragraphs):
    #Here we take advantage of the \t\t prefixzes to extract numbered list
    input_rows=[['','']]
    heading=''
    for (number,paragraph) in enumerate(paragraphs):

        paragraph=re.sub(r'----media.image\d+.png----','', paragraph) #Remove links to pictures
        paragraph=re.sub(r'.*(DOE [A-Z] \d+.\d+)','', paragraph) #Remove DOE headers
        paragraph=re.sub(r'^.*Page \d+','', paragraph) #Remove page numbers
        paragraph=re.sub(r'\d{1,2}-\d{1,2}-\d{4}','', paragraph) #Remove dates

        if not paragraph:
            #Skip empty lines - artifact of importing or everything was removed
            continue
        if '\t' in paragraph:
            #This is a nested list. Update Heading
            text=paragraph.split('\t')[-1]
            heading=paragraph.split('\t')[0:-1]
            #if text[-1]==':': #This is a list an quite likely next elements don't have tabs
            #    prepend=['\t']*len(heading)
            input_rows.append([heading,text])
        else:
            #This is probably a leftover from the previous page
            # Then add it to the previous paragraphs
            input_rows[-1][1]=input_rows[-1][1]+paragraph
    return input_rows


def parse_docx2(pathname, make_csv=False):
    doc_result = docx2python(pathname)
    paragraphs = list(iter_paragraphs(doc_result.body))
    input_rows=split_paragraphs(paragraphs)
    results_rows=manage_list(input_rows)

    if make_csv:
        save_csv(results_rows,os.path.splitext(pathname)[0]) #Save without *.pdf at the end
    return results_rows

def manage_list(input_rows):
    #header=input_rows.pop(0)
    lvl=[0]*15 #Keep four numbers in increment them as we see more and more
    lvl_txt=['']*15
    results_rows=[['Heading','Description','shall','should','may','must','notes']]

    for (row_num,row) in enumerate(input_rows):
        if not row[0]:
            continue
        elif row[0]==['']: #Skip empty rows
            keywords=parse_paragraph(row[1])
            results_rows.append(['--']+[row[1]]+keywords)
        #Count how many '' in the string. This will determine the level
        else:
            for i in range(len(row[0])):
                try:
                    if row[0][i]: #We have an entry of level i in this row
                        lvl[i]=lvl[i]+1 #increment level i
                        lvl[i+1:]=[0]*len(lvl[i+1:]) #if we increment higher level reset all lower levels
                        lvl_txt[i]=row[0][i] #increment level i
                        lvl_txt[i+1:]=['']*len(lvl[i+1:]) #if we increment higher level reset all lower levels

                        #Convert list to sting via python magic:
                        lvl_string=[x.replace(')','')  for x in lvl_txt]
                        lvl_string='.'.join(filter(None, lvl_string)) #Remove trailng zeros - otherise innoslte doesnt understand

                        keywords=parse_paragraph(row[1]) #Check for "must" "shall" etc.

                        results_rows.append([lvl_string]+[row[1]]+keywords)
                except:
                    keywords=parse_paragraph(row[1])
                    results_rows.append(['error']+[row[1]]+keywords)
    return results_rows

def get_csv(pathname):
    rows = parse_docx2(pathname, True)
    return rows

def get_obj(pathname):
    rows = parse_docx2(pathname)
    return rows
