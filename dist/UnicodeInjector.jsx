//
// UnicodeInjector.jsx
//
// Version 0.0.1
//
// (C) 2011-2012 Rorohiko Ltd.
// All rights reserved.
// By Kris Coppieters
// kris@rorohiko.com
//
// How it works
// ------------
//
// This script will insert a sequence of one or more Unicode
// characters at the current insertion point in InDesign
//
// This script is a bit odd in that it is configured by renaming a 
// copy of the UnicodeInjector.jsx file.
// 
// The idea is that you make one or more copies of this script,
// rename them according to the desired goal, and place these 
// copies into your scripts folder.
//
// For example, if you rename a copy of this script to:
//
//   U+0061 U+0062 Insert Unicode chars.jsx
//
// and then copy it into your InDesign Scripts folder, each time
// you set your text cursor in some text, then double-click the script 
// (or hit a keyboard shortcut if you assign one), it will insert the
// unicode characters U+0061 and U+0062 (that is, 'A' and 'B' - it's a 
// silly example).
//
// Installing
// ----------
//
// Make a copy of the 
//
//   UnicodeInjector.jsx
//
// file.
//
// Look up the Unicode characters you desire to insert (e.g. assume we want to 
// insert a hair space, U+200A).
//
// Rename the copy so it contains the desired unicode(s) as well as some descriptive
// text - e.g.
// 
//   U+200A Insert a hair space.jsx
//
// Move the 'U+200A Insert a hair space.jsx' script to your InDesign Scripts
// folder. 
//
// The easiest way to do that is to start InDesign, then show the Scripts Palette.
// (It's under 'Window - Automation' or 'Window - Utilities'). 
//
// Right-click or Control-click on the 'User' entry on the Scripts Palette
// and select 'Reveal in Explorer' or 'Reveal in Finder'
//
// In the folder that opens, double-click the 'Scripts Panel' folder so it
// opens up. 
//
// Move the newly renamed script into the Scripts Panel folder.
//
// Go back to InDesign - the script is ready for use. Position your text cursor
// by double-clicking in any text frame, then double-click the script name on the
// Scripts Palette; the unicode character(s) will be inserted.
//
// To assign a keyboard shortcut to the script, go to the 
// Edit - Keyboard Shortcuts... menu. If you have not done so
// some time before, make a new set by clicking the 'New Set...' button.
//
// If you already have a custom set, feel free to add to that set instead.
//
// Select the 'Scripts' Product Area, and then find your scripts in 
// the list. Assign any keyboard shortcuts as desired.
// 
// Repeat this procedure as many times as needed - you can have as many
// copies of this script as you want.
// 
// More info
// ---------
//
// This script will ignore any descriptive text in the file name.
// So in the above example, the text 'Insert Unicode chars' is 
// ignored - only the U+0061 and U+0062 is interpreted.
//
// The script understands the following notations:
//
// U+nnnn (U, +, then 1 to 4 hexadecimal digits)
//   Examples: U+0041, u+20eF, u+61
// 0xnnnn (0, x, then 1 to 4 hexadecimal digits)
//   Examples: 0x0041, 0x20Ef, 0X61
// 0dnnnnn (0, d, followed by 1 to 5 decimal digits)
//   Examples: 0d65, 0d8431, 0D97 
//
// So the script whose filename is:
//
//   Insert the letter a with code 0d65.jsx
// 
// will insert the letter 'a', as it contains '0d' followed 
// by a decimal number 65
// 
// You might need to insert spaces when using multiple codes
// and 0x or 0d notation.
// 
// For example, 0x61 0x61 will insert two 0x61 codes, whereas
// 0x610x61 will insert a single 0x610 code, and will ignore
// the x61. 
// 
// Where do you find the various unicode characters? 
//
// You can start by consulting the following downloadable text file:
//
//   http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
//
// Example: you can find the following line:
//
// ...
// 200A;HAIR SPACE;Zs;0;WS;<compat> 0020;;;;N;;;;;
//
// This means that to insert a hair space, you'd rename your
// script file to something similar to:
//
//   U+200A Insert a hair space.jsx
//
// Then copy it into the scripts palette, double click it to 
// insert a hair space.
//
//

// This is the 'faked' script name used when you run the script from the
// ExtendScript Toolkit
const kDebugSampleScriptName = "U+0061 U+0062 Insert Unicode chars.jsx";

const kUnicodeRegEx = /^(.*?u\+([0-9a-f]{1,4}))(.*)$/i;
const kHexaRegEx = /^(.*?0x([0-9a-f]{1,4}))(.*)$/i;
const kDeciRegEx = /^(.*?0d([1-9][0-9]*))(.*)$/i;

const kErr_NoError = 0;
const kErr_NoSelection = 1;
const kErr_MissingCodes = 2;

var error = kErr_NoError;

do
{
    
    if (app.selection == null)
    {
        error = kErr_NoSelection;
        break;
    }

    if (! (app.selection instanceof Array))
    {
        error = kErr_NoSelection;
        break;
    }

    if (app.selection.length != 1)
    {
        error = kErr_NoSelection;
        break;
    }

    if (! (app.selection[0] instanceof InsertionPoint))
    {
        error = kErr_NoSelection;
        break;
    }

    var fileName; 
    var err;
    try
    {
        if (app.activeScript instanceof File)
        {
            fileName = app.activeScript.name;
        }
        else 
        {
            fileName = kDebugSampleScriptName;
        }
    }
    catch (err)
    {
        fileName = kDebugSampleScriptName;
    }
    
    var fileNameWasPrefixedWithCode;
    var charCode;
    var numberBase;
    var numericalCharCode;
    var matchingRegEx;
    
    error = kErr_MissingCodes;

    // Start a loop that strips code prefixes from the filename 
    // one by one, until all codes have been processed
    do
    {
        fileNameWasPrefixedWithCode = false;
    
        if (fileName.match(kUnicodeRegEx) != null)
        {
            matchingRegEx = kUnicodeRegEx;
            numberBase = 16;
        }
        else if (fileName.match(kHexaRegEx) != null)
        {
            matchingRegEx = kHexaRegEx;
            numberBase = 16;
        }
        else if (fileName.match(kDeciRegEx) != null)
        {
            matchingRegEx = kDeciRegEx;
            numberBase = 10;
        }
        else
        {
            matchingRegEx = null;
        }

        if (matchingRegEx != null)
        {
            charCode = fileName.replace(matchingRegEx,"$2");

            if (charCode != "")
            {
                numericalCharCode = parseInt(charCode, numberBase);
                if (! isNaN(numericalCharCode) && numericalCharCode != 0)
                {
                    error = kErr_NoError;
                    app.selection[0].contents = String.fromCharCode(numericalCharCode);

                    fileNameWasPrefixedWithCode = true;
                    // Strip off the code we just processed, and then loop back to try 
                    // to get the next code, if any
                    fileName = fileName.replace(matchingRegEx,"$3");
                }
            }
        }
    }
    while (fileNameWasPrefixedWithCode);
}
while (false);

switch (error)
{
case kErr_NoSelection:
    alert("Please make sure you put your text cursor in a text frame, but don't select any text");
    break;
case kErr_MissingCodes:
    alert("To configure this script, it needs to be renamed. Please open this script with a text editor and read the instructions inside");
    break;
}