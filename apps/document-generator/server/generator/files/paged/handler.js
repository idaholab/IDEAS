
class handlers extends Paged.Handler {
constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
}

beforeParsed(content){          
    createToc({
    content: content,
    tocElement: 'nav',
    titleElements: [ '.data h1' ]
    });
}

}
Paged.registerHandlers(handlers);