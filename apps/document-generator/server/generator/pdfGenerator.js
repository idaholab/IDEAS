const axios = require('axios');
const fs = require('fs');

class PDF {
    constructor(data) {
        this.data = data;
        this.nodes = this.data.nodes;
        this.style = this.data.stylesheet;
        this.html = '';
        this.docx = null;
    }

    async make() {
        this.html += 
        `
        <html>
            <head>
            <link rel="stylesheet" href="style.css">
            </head>
        <body>

        <section class="title">
            <h1>${this.data.title}</h1>
        </section>
        
        <section class="disclaimer"></section>

        <section class="table-of-contents">
            <h1>Table of Contents</h1>
            <nav class="toc"></nav>
        </section>
        `

        let documentSection = undefined; // This is a hack

        this.nodes.forEach(element => {

            switch (element.number.length) {
                case 1:
                    // Depending on whether or not the element number is a header, e.g. 1, 2, or 3, enclose it in the <section> HTML tag, allowing the Paged service to recognize it as a distinct section of the document.
                    if(!documentSection) {
                        this.html += `<section class="data">`;
                        documentSection = element.number;
                    } else {
                        this.html += `
                        </section>
                        <section class="data">
                        `
                        documentSection = undefined;
                    }
                    
                    this.html += `
                    <h1>${element.number}</h1>
                    `
                    break
                case 3:
                    this.html += `<h2>${element.number}</h2>`
                    break
                case 5:
                    this.html += `<h3>${element.number}</h3>`
                    break
            }
            
            this.html += element.primary_text;
        })

        this.html += `</section></body></html>` // Close the final section tag.
        
        return await this.build();
    }
    
    async build() {
        fs.writeFileSync(`./generator/files/${this.data.id}.html`, this.html, function(err) {
            if(err) {
                return console.log(err);
            }
        })

        let paged_server_return_code = await axios.post(`http://paged:5001/paged`, {id: this.data.id}).then(response => {
            return response.data;
        })

        if(paged_server_return_code !== "OK") {
            throw new Error(paged_server_return_code);
        }
    }
    
}

module.exports = PDF;