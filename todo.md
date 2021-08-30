## TODO

### Editor
IP  Add Custom Toolbar                         
        - Custom Font ✓
        - Bold, Italic, Underline ✓
        - Header, BodyText... ✓
        - Custom Colours    ✓
        - Insert SVG Images ✓
        - Insert Images     ✓
        - Insert Tables     ☐
    
    Custom / Propietary JSON Converter and Formatting
        - Save data from editor ✓
        - Store efficently ✓
        - Retrieval w/ 100% conversion (0% loss) ✓

    Add Tab Functionality 
        - Indent Page, etc... ✓

    Optimise Rendering for Per-Chapter
        _A: Create Paginated Rendering for Chapters with Seemless Transitioning.

    Chapter Stylings
        - Create Chapter Stylings such as custom title variations, trends, icons, ...

    Customisable First Letter/First Word Format
        _I: Modulate the first word or character to be customisable, following a different style.

    Custom Fonts
        - Allow users to upload fonts, or use existing local fonts to style text
        _N: Local fonts will not be viewable by shared parties.

    Grammar Checker?
        - Unlikely Implementation, but a grammar checker API.
    

### Transcribe 
    Offload content to Database
        - Add Authentication ✓
        - Add Main Homepage for Users ✓
        - Load Content from Database e.g. Project Files ✓

    Add Artifact Sheets
        - Create UI Components
        - Create Database Structuring and Cross-Project Sharing Capabilities
        - Integrate into Software

    MultiDocument Workspace
        - Add rendering/ loading for each individual document
        - Store prefrences regarding locations of elements
        - Modular Viewport for Multiple Document Components

    Export Formats & Exporting
        _A: Render document with CSS as a DOM in another (or combined) window
        - Use new DOM to be exportable as print object (CTRL + P)
        - Allow exporting to PDF.
        _I: Find API or NPM Package to export to XML Word, or likewise.

    Allow file-based importing
        _I: Allow importing existing projects from .txt, and others...

    ShareParties / BetaReaders
        - Allow document and DataStorage to be stored under cohesive ID
        _A: cohesive ID and permission restrictions can be shared to others for reading and commenting.
        - Database Duplication or Replication? or Refencing?

### General
    Document Export
        - Disable/Modular Theme Typing
        - Support Formats
        - Integrate Theming
        - Document Downloading

    Document Prefrences
        - Create Modal ✓
        - Add Settings ✓
        - Sync Settings ✓

    Project Prefrences / Settings
        - Create and Sync Information
        - Create Modal
        - Integate for Exporting
        - Parameters: {  default book, author, title, attributes, book no., publisher, rename project, project title, project description, etc... + Project Pref. e.g. theme, mode, default fonts, load custom fonts, etc.  }

    New Items
        - Allow for creation of documents ✓
        - Choose Document Types + Document Modal ✓

    New User Functionality
        - Tooltips
        - Instructions
        - Help & Guidance
        - (Hints, e.g. Theme isnt directly applicable so dont spend hours doing that... )

    Different File Types
        _A Functionality for Vision Boards 
        - Plain Editable Document ✓
        - Artifacts (Backend Smooth Integration), In Documents, able to search and pull for arficats as refrence material. These can be plain documents with linkers.

    Shareability
        - Share Document (View Only - No Edit) ✓
        - Document Permission (No Share or Share) ✓
        - Share Clone'd Versions for Private Reviewal 
        - Account-Based Sharing Permissions
        - Global Based Share, No Share + 404 ✓
        - Ability to share (clone), documents to peers, who can (depending upon permissions) edit, share, comment, highlight etc.
            These elements will not edit the main document, but shall act as proxies in which the main document can be refrenced, so the author can make changes or others, as deemed neccesary in order to ensure the consistency of the main document. Separate viewing and syncing protocols must be implemented such a viewer.

[_A] Advanced Item - May take longer to implement than ususal.
[_I] Indecisive - Unpredictable, hence may not be implementable.
[_N] Note - A comment regarding the implementation of the specified feature.

IP In Progress - The specified feature is currently being worked on.