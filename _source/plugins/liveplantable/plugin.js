///**
// * @file LivePlan Table plugin
// */
//
//var onSelectionChange = function ( evt ) {
//    if ( evt.editor.readOnly ) {
//        return null;
//    }
//
//    var path = evt.data.path,
//        blockLimit = path.blockLimit,
//        elements = path.elements,
//        element,
//        i;
//
//    // Grouping should only happen under blockLimit.(#3940).
//    for ( i = 0 ; i < elements.length && ( element = elements[ i ] ); i++ )
//    {
//        if ( elements[ i ].getName() === 'table' ) {
//            return this.setState( CKEDITOR.TRISTATE_ON );
//        }
//    }
//
//    return this.setState( CKEDITOR.TRISTATE_OFF );
//};
//
//var createOrEditTable = function (editor, data) {
//    var doc = editor.document, rows = parseInt(data.rows, 10), cols = parseInt(data.cols, 10), firstCell;
//
//    // make a new element, or turn an HTMLElement into a CKEDITOR.element
//    var makeElement = function( name ) {
//        return new CKEDITOR.dom.element( name, editor.document );
//    };
//
//    // check to see if we're in a table already, which we will EDIT
//    var currentTable = editor.getSelection().getStartElement().getAscendant('table', true);
//
//    // if we are NOT in a table, create an empty table
//    if (!currentTable) {
//        currentTable = makeElement('table');
//        currentTable.append(makeElement('tbody'));
//
//        // without this class, the table is invisible
//        currentTable.addClass('cke_show_border');
//        editor.insertElement(currentTable);
//    }
//
//    var t = currentTable.$;
//
//    // clean up rows
//    while (t.rows.length !== rows) {
//        if (t.rows.length < rows) {
//            // add a new row
//            t.insertRow(t.rows.length);
//        } else {
//            // delete a row
//            t.deleteRow(t.rows.length - 1);
//        }
//    }
//
//    // clean up columns
//    for (var i = 0; i < t.rows.length; i++) {
//        // if we need more columns than what are present, add columns
//        while (t.rows[i].cells.length !== cols) {
//            if (t.rows[i].cells.length < cols) {
//                var cell = t.rows[i].insertCell(t.rows[i].cells.length);
//                if (!firstCell) {
//                    firstCell = cell;
//                }
//                if (!CKEDITOR.env.ie) {
//                    makeElement(cell).append(makeElement('br'));
//                }
//            } else {
//                t.rows[i].deleteCell(t.rows[i].cells.length - 1);
//            }
//        }
//    }
//
//    setTimeout( function()
//            {
//                // move cursor to first created cell, if any were created
//                if (firstCell) {
//                    var range = new CKEDITOR.dom.range( editor.document );
//                    range.moveToPosition( makeElement(firstCell), CKEDITOR.POSITION_AFTER_START );
//                    range.select( 1 );
//                }
//            }, 0 );
//
//};
//
//  // Register a plugin named "liveplantable".
//CKEDITOR.plugins.add( 'liveplantable', {
//  init : function( editor )
//  {
//    var liveplantable;
//
//    var liveplantableCmd = {
//        exec : function( editor )
//        {
//
//            var currentTable = editor.getSelection().getStartElement().getAscendant('table', true);
//
//            var rowField, colField, rowLength = 2, colLength = 2;
//            rowField = new Ext.form.NumberField({fieldLabel: 'Rows', value: rowLength, selectOnFocus: true, allowNegative: false, minValue: 1, maxLength: 3});
//            colField = new Ext.form.NumberField({fieldLabel: 'Columns', value: colLength, selectOnFocus: true, allowNegative: false, minValue: 1, maxLength: 3});
//
//            if (currentTable) {
//                rowLength = currentTable.$.rows.length;
//                colLength = currentTable.$.rows.length ? currentTable.$.rows[0].cells.length : 1;
//
//                // set initial values to the number of rows and columns
//                rowField.setValue(rowLength);
//                colField.setValue(colLength);
//            }
//
//            var itemArray = [
//                 rowField,
//                 colField
//             ];
//
//            // if we're actuall editing, let's give the user the option to delete the table
//            if (currentTable) {
//                itemArray.push({xtype: 'aquabutton', color: 'gray', text: "Delete Table"});
//            }
//
//            var overlay = new Ext.ux.Overlay({
//                title: currentTable ? "Create Table" : "Edit Table",
//                closable: true,
//                dialog: true,
//                layout: 'form',
//                items: itemArray,
//                buttons: [
//                          {itemId: 'cancel', text: 'Cancel', xtype: 'aquabutton', color: 'text', handler: function () {
//                              overlay.close();
//                          }, scope: this},
//                          'or',
//                          {itemId: 'ok', text: 'OK', xtype: 'aquabutton', color: 'primary', handler: function () {
//
//                              var data = {
//                                  rows: rowField.getValue(),
//                                  cols: colField.getValue()
//                              };
//
//                              // If this will truncate rows, ask the user to confirm
//                              if (data.rows < rowLength || data.cols < colLength) {
//                                  overlay.hide();
//                                  bpo.message.confirm(false, 'Are you sure? This will delete part of your table.', function (id) {
//                                      if (id === 'yes') {
//                                          createOrEditTable(editor, data);
//                                      } else {
//                                          overlay.show();
//                                      }
//                                  });
//
//
//                              } else {
//                                  createOrEditTable(editor, data);
//                              }
//                              overlay.close();
//
//                          }, scope: this}
//                ]
//            });
//            overlay.show();
//
//        }
//      };
//
//    // register command
//    var liveplantableCommand = editor.addCommand( 'liveplantable', liveplantableCmd );
//
//    editor.on( 'selectionChange', CKEDITOR.tools.bind( onSelectionChange, liveplantableCommand ) );
//
//    // register toolbar button
//    editor.ui.addButton( 'LivePlanTable',
//        {
//            label : 'Table',
//            command : 'liveplantable'
//        }
//    );
//
//
//
//  }
//});
