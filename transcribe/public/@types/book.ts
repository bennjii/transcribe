export type Book = {
    name: string,
    cover: string | ImageBitmap,
    chapters: Chapter[]
}

export type Chapter = {
    title: string,
    format: object,
    content: Paragraph[]
}

export type Paragraph = {
    text: string,
    format: object
}