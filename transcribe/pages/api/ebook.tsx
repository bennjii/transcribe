import Epub from 'epub-gen'

export default (req, res) => {
    const data = req.body;
    let output;

    new Epub(data, `./output/${data.title.replace(/ /g, "_").toLowerCase()}.epub`).promise.then(
        (e) => console.log("Ebook Generated Successfully!", e),
        err => console.error("Failed to generate Ebook because of ", err)
    );

    res.status(200).json(output)
}
  