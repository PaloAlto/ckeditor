/**
 * @file wordcount plugin.
 */

  // Register a plugin named "wordcount".
CKEDITOR.plugins.add( 'wordcount', {
  init : function( editor )
  {
    var fn, wordcountCmd;

    wordcountCmd = {
        editorFocus: false,
        exec : function( editor, data )
        {
          // find the number of spaces
          if ((data && data.force) || (editor.checkDirty && editor.checkDirty())) {
            // if (!this.el && bpo.widgetRegistry.getEditor().editor.container) {
            //   if (!(this.el = Ext.get(bpo.widgetRegistry.getEditor().editor.container.$).select('.cke_bottom span.wordcount').first())) {
            //     this.el = Ext.get(bpo.widgetRegistry.getEditor().editor.container.$).child('.cke_bottom').createChild({tag: 'span', cls: 'wordcount'});
            //   }
            // }

            if (!this.el) {
              var wordCountEl = new CKEDITOR.dom.element('span');
              wordCountEl.addClass('wordcount');
              var bottomSpace = editor.ui.space( 'bottom' );
              wordCountEl.appendTo(bottomSpace);
              this.el = wordCountEl;              
            }

            var data, count;
            data = editor.getData().replace(/<.*?>|&nbsp;/g, '').trim();
            if (data.length < 1) {
              count = 0;
            } else {
              count = (data.match(/\s+/g) || []).length + 1;
            }

            this.el.setText(count.toString() + (count === 1 ? ' word' : ' words'));
          }
        }
      };

    editor.addCommand( 'wordcount', wordcountCmd );

    fn = function () {
      if (editor && editor.window) {  // editor may well be destroyed in 350 ms!
        editor.execCommand('wordcount');
      }
    };

    editor.on('key', _.throttle(fn, 250));
    editor.on('dataReady', function () {
      editor.execCommand('wordcount', {force: true})
    });
  }
});
