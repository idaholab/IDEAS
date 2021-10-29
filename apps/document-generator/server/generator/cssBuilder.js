const {toCSS} = require('cssjson');
const fs = require('fs');

function transformCSS(metadata, files) {
    /* 
        This function accepts metadata from the front-end, and maps it to a JSON object having fields required by the PagedJS service.
        Once the JSON object is built, it is transformed into CSS and written to the filesystem, where it is available to PagedJS.
    */
    let stylesheet = JSON.parse(metadata.stylesheet);
    let json = {
        "children": {
            "@page": {
                "children": {},
                "attributes": {
                    "size": `letter ${stylesheet.document.orientation}`,
                    "margin": `${stylesheet.document.margins.x}mm ${stylesheet.document.margins.y}mm`    
                }
            }, 
            "@page title": {
                "children": {},
                "attributes": {
                    "background-image": `url('./${files.cover}')`,
                    "background-size": "100% auto"
                }
            },
            ".title": {
                "children": {},
                "attributes": {
                    "page": "title"
                }
            },
            "@page disclaimer": {
                "children": {},
                "attributes": {
                    "background-image": `url('./${files.disclaimer}')`,
                    "background-size": "100% auto"
                }
            },
            ".disclaimer": {
                "children": {},
                "attributes": {
                    "page": "disclaimer"
                }
            },
            "@page table-of-contents": {
                "children": {},
                "attributes": {
                    "background-image": `url('./${files['table of contents']}')`,
                    "background-size": "100% auto"
                }
            },
            ".table-of-contents": {
                "children": {},
                "attributes": {
                    "page": "table-of-contents",
                    "list-style": "none",
                    "overflow-x": "hidden",
                    "color": "black"
                }
            },
            ".toc-element": {
                "children": {},
                "attributes": {
                    "display": "flex"
                }
            },
            ".toc-element::after": {
                "children": {},
                "attributes": {
                    "content": "'..........................................................................................................................................'",
                    "float": "left",
                    "width": "0",
                    "padding-left": "5px",
                    "letter-spacing": "2px"
                }
            },
            ".toc-element a::after": {
                "children": {},
                "attributes": {
                    "position": "absolute",
                    "right": "0",
                    "background-color": "white",
                    "padding-left": "6px"
                }
            },
            "a": {
                "children": {},
                "attributes": {
                    "color": "black",
                    "text-decoration": "none"
                }
            },
            "@page data": {
                "children": {},
                "attributes": {
                    "background-image": `url('./${files.page}')`,
                    "background-size": "100% auto"
                }
            },
            ".data": {
                "children": {},
                "attributes": {
                    "page": "data",
                    "break-before": "page",
                    "font-weight": "lighter"
                }
            },
            ".title > h1": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(stylesheet.fonts['title'])
                }
            },
            "h1": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(stylesheet.fonts['heading'])
                }
            },
            "h2": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(stylesheet.fonts['heading'])
                }
            },
            "h3": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(stylesheet.fonts['heading'])
                }
            },
            "p": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(stylesheet.fonts['paragraph'])
                }
            }
        }
    }

    let css = toCSS(json); 
    fs.writeFile(__dirname + '/files/preview/preview.css', css, (error) => {
        if (error) {
            console.log(error)
        }
    });

    
}



module.exports = {transformCSS};