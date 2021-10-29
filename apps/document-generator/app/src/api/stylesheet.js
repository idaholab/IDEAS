import {toCSS} from 'cssjson';

export function stylesheetBuilder(metadata) {
    let json = {
        "children": {
            "@page": {
                "children": {},
                "attributes": {
                    "size": `letter ${metadata.document.orientation}`,
                    "margin": `${metadata.document.margins.x}mm ${metadata.document.margins.y}mm`    
                }
            }, 
            "@page title": {
                "children": {},
                "attributes": {
                    "background-image": `url('./${metadata.background.cover}')`,
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
                    "background-image": `url('./${metadata.background.disclaimer}')`,
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
                    "background-image": `url('./${metadata.background['table of contents']}')`,
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
                    "background-image": `url('./${metadata.background.page}')`,
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
                    "font-family": JSON.stringify(metadata.fonts['title'])
                }
            },
            "h1": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(metadata.fonts['heading'])
                }
            },
            "h2": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(metadata.fonts['heading'])
                }
            },
            "h3": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(metadata.fonts['heading'])
                }
            },
            "p": {
                "children": {},
                "attributes": {
                    "font-family": JSON.stringify(metadata.fonts['paragraph'])
                }
            }
        }
    }

    let css = toCSS(json); 
    return css;
}