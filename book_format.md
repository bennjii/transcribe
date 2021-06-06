# Book Format

## JSON
{
    "name": 'Book Title',
    "cover": 'Image URL or Object'
    "chapters": [
        {
            "title": 'Chapter 1',
            "format": {
                "font_family": '...',
                "font_size": '...',
                "color": '...'

                // apply these by itterating over the keys
                // and applying the values through CSS
            }
            // Paragraphs
            "content": [
                {
                    "text": "Lindon was a world of opportunity...", 
                    // Markdown formatting e.g. bold and italics... *HEY*.

                    "format": {
                        "font_family": '...',
                        "font_size": '...',
                        "color": '...'
                    }
                }
            ]
        }
    ],
}