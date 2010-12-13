/**
 * @file charcount plugin.
 */

  // Register a plugin named "charcount".
CKEDITOR.plugins.add( 'charcount', {
  init : function( editor )
  {
    var fn, charcountCmd, invalid = false, errorEl = false;
    if (!editor.config.charcount_maxchars) {
      editor.config.charcount_maxchars == 500000;
    }
    if (editor.config.charcount_error_element) {
      errorEl = document.getElementById(editor.config.charcount_error_element);
    }
    var reportCount = false;
    if (editor.config.charcount_report) {
      reportCount = true;
    }
    charcountCmd = {
        exec : function( editor, event ) {
          // find the number of spaces
          var plaintext = editor.getData().replace(/<.*?>/g, '').trim();

          if (reportCount) {
            if (!this.el) {
              if (!(this.el = Ext.select('.cke_top span.charcount').first())) {
                this.el = Ext.select('.cke_top').first().createChild({tag: 'span', cls: 'charcount', style: 'float: right;'});
              }
            }

            this.el.update(plaintext.length + ' characters');
          }

          if (editor.checkDirty && editor.checkDirty() && plaintext.length > editor.config.charcount_maxchars) {

            // do something
            invalid = true;
            if (errorEl) {
              errorEl.style.display = 'block';
            }
            if (reportCount && this.el) {
              this.el.dom.style.color = "red";
            }
          } else {
            if (invalid) {
              if (errorEl) {
                errorEl.style.display = 'none';
              }
              if (reportCount && this.el) {
                this.el.dom.style.color = "black";
              }
            }
            invalid = false;
          }
        }
      };

    window.charcountP = charcountCmd.exec;

    editor.addCommand( 'charcount', charcountCmd );

    editor.on('key', function (e) {
      editor.execCommand('charcount', e);
    });
    editor.on('instanceReady', function () {editor.execCommand('charcount');});
  }
});
