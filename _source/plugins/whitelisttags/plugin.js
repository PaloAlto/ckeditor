/**
 * @file whitelisttags plugin.
 */

  // Register a plugin named "whitelisttags".
CKEDITOR.plugins.add( 'whitelisttags', {
  init : function( editor )
  {
    var whitelistCmd, whitelist, parsed = '';
    if (!editor.config.whitelist) {
        editor.config.whitelist = ['b','i','em','strong','u','ul','ol','li','blockquote','p','br'];
      }


    if (typeof editor.config.whitelist_convert_blocks === 'undefined') {
      editor.config.whitelist_convert_blocks = true;
    }
    whitelist = new RegExp('^(' + editor.config.whitelist.join('|') + ')$');



    whitelistCmd = {
      exec : function( editor, html ) {
        // parse an HTML document
        var inList = false, parser = new CKEDITOR.htmlParser();
        var depth = [];

        var getTagName = function (tagName, selfClosing) {
          // return the tag to use, or false if no tag should be rendered

          var isListItem = (tagName === 'li'),
              listContainer = (/^[uo]l$/),
              isListContainer = !isListItem && listContainer.match(tagName),
              inListContainer = listContainer.match(depth[depth.length - 1]),
              listDepth = depth.join(',').split('li').length - 1;

          // list item not directly inside a list
          if (isListItem && !inListContainer) {
            return('p');
          }

          // already inside an <li> - turn <li> into <p> and don't render <ul> or <ul>
          if ((isListItem || isListContainer) && listDepth > 0) {
            return (isListItem) ? 'p' : false;
          }

          // non-list-item directly inside a list
          if (!isListItem && inListContainer) {
            return ('li');
          }

          var isLegal = whitelist.match(tagName),
              isBlock = Boolean(CKEDITOR.dtd.$block[tagName]);

          if (isLegal) {
            // render this tag
            return tagName;	// note that this is the only instance of `return tagName`
          } else {
            // if this is an illegal block element with children, render a p
            return (isBlock && !selfClosing) ? 'p' : false;
          }

          // He's dead, Jim
          return false;
        };

        parser.onTagOpen = function (tagName, attributes, selfClosing) {
          if (!tagName) {
            return;
          }

          var filteredTagName = getTagName(tagName, selfClosing);

          if (!selfClosing) {
            depth.push(tagName);
          }

          if (filteredTagName) {
            parsed += (selfClosing ? "<" + filteredTagName + " />" : "<" + filteredTagName + ">");
          }
        };

        parser.onTagClose = function (tagName) {
          if (!tagName) {
            return;
          }

          if (depth[depth.length - 1] === tagName) {
            depth.pop();
          }

          var filteredTagName = getTagName(tagName, false);

          if (filteredTagName) {
            parsed += "</" + filteredTagName + ">";
          }
        };

        parser.onText = function (text) {
          var lastTag = depth[depth.length - 1],
              isWhitespace = /^(\s|&nbsp;)*$/.match(text);

          // text should be in a p
          if (!isWhitespace && ['b','i','em','strong','u','p'].indexOf(lastTag) === -1) {
            text = '<p>' + text + '</p>';
          }

          // lists can only directly contain list items
          if (!isWhitespace && (lastTag === 'ol' || lastTag === 'ul')) {
            text = "<li>" + text + "</li>";
          }
          parsed += text;
        };

        if (html) {
          parser.parse(html);
        } else {
          html = editor.getData();
          parser.parse(html);
          editor.setData(parsed);
          parsed = '';
        }

      }
    };

    editor.addCommand( 'whitelisttags', whitelistCmd );

    // add our parser to the paste event
    editor.on('paste', function (e) {
      if (e.data.html) {
      editor.execCommand('whitelisttags', e.data.html);
        e.data.html = parsed;
        parsed = '';
      }
    });

  }
});
