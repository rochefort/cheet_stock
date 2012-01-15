// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require_tree .
$(function(){
  var KEY_CODE_TAB = 9;
  var KEY_CODE_ENTER = 13;


  // console.log(e.keyCode);
  // console.log(e.shiftKey);
  // console.log(e.ctrlKey);
  // console.log(e.altKey);
  $('td.key .editor input').live('keydown', (function(e){
    if (e.keyCode == KEY_CODE_TAB) {
      var content = $(this).closest('tr').find('td.content');
      displayInputElm(content);
      return false;
    };
    if (e.keyCode == KEY_CODE_ENTER) {
      $(this).blur();
    };
  }));

  $('td.content .editor input').live('keydown', (function(e){
    if (e.keyCode == KEY_CODE_TAB) {
      if (e.shiftKey) {
        var key = $(this).closest('tr').find('td.key');
        displayInputElm(key);
        key.find('.editor input').focus();
      } else {
        var content = $(this).closest('tr').find('td.content');
        displayInputElm(content);
      };
      return false;
    };
    if (e.keyCode == KEY_CODE_ENTER) {
      $(this).blur();
    };
  }));

  function ajaxWithJSON (url, data, succFunc) {
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data:  data,
      success: succFunc
    })
  }

  $('.column').sortable({
    connectWith: '.column',
    handle: 'h2',
    cursor: 'move',
    placeholder: 'placeholder',
    forcePlaceholderSize: true,
    opacity: 0.4,
    update: function() {
      var objSort = $(this).sortable('serialize');
      objSort['authenticity_token'] = $('#authenticity_token').val();
      ajaxWithJSON('/groups/reorder', objSort);
    }
  })
  .disableSelection();

  $('.key-mapping table tbody').sortable({
    connectWith: '.key-mapping table tbody',
    cursor: 'move',
    opacity: 0.4,
    update: function(event, ui) {
      var groupId = $(this).closest('div.dragbox').attr('id').split('-')[1];
      var objSort = $(this).sortable('serialize');
      objSort['authenticity_token'] = $('#authenticity_token').val();
      var url = '/groups/' + groupId + '/key_mappings/reorder';
      ajaxWithJSON(url, objSort);
    }
  })
  .disableSelection();

  $('#add-group').click(function(){
    var succFunc = function(ajax){
      if (ajax.status === 'success') {
        $('.column').append(ajax.html);
        //TODO:focus
        $('.key-mapping table tbody').sortable('refresh');
      }
    };
    ajaxWithJSON('groups', '', succFunc);
  });

  $('.add-key-mapping').live('mouseover', function(){
    $(this).css('background', '#f0f0f0');
  });
  $('.add-key-mapping').live('mouseout', function(){
    $(this).css('background', '');
  });
  
  
  $('.add-key-mapping').live('click', function(){
    var groupId = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var parentElm = $(this).closest('div.dragbox').find('table');
    var url = '/groups/' + groupId + '/key_mappings/';
    var succFunc = function(ajax){
      if (ajax.status === 'success') {
        parentElm.append(ajax.html);
        //TODO:focus
      }
    };
    ajaxWithJSON(url, '', succFunc);
  });

  $('h2').live('click', function(){
    displayInputElm($(this));
  });
  
  $('h2').live('blur', function(){
    var groupName = $(this).find('.editor input').val();
    $(this).find('.viewer').text(groupName);

    var groupId = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var group = {'name': groupName};
    var url = '/groups/' + groupId;
    var data = {'_method': 'put', 'group': group};
    ajaxWithJSON(url, data);
    $(this).find('div').toggle();
  });

  $('.delete-group').live('click', function(){
    var groupId = $(this).closest('div.dragbox').attr('id').split('-')[1];
    $('#delete-group-msg').dialog({
      title: "確認",
      buttons: {
        'yes': function(event) {
          var url = '/groups/' + groupId;
          var data = {'_method': 'delete'};
          var succFunc = function (ajax){ $('#group-' + groupId).remove();};
          ajaxWithJSON(url, data, succFunc);
          $(this).dialog("close");
        },
        'no': function(event) {
          $(this).dialog("close");
        }
      }
    });
  });

  $('td.key').live('click', function(){
    displayInputElm($(this));
  });

  $('td.content').live('click', function(){
    displayInputElm($(this));
  });

  // key-mapping更新処理  
  $('td.key').live('blur', function(){
    updateKeyMappingAndToggleElm($(this), 'key');
  });

  $('td.content').live('blur', function(){
    updateKeyMappingAndToggleElm($(this), 'content');
  });

  function updateKeyMappingAndToggleElm (elm, columnName) {
    var editor = elm.find('.editor');
    if (editor.css('display')=='block') {
      updateKeyMapping(elm, columnName);
      elm.find('div').toggle();
    };
  }

  function updateKeyMapping (elm, columnName) {
    // テキストボックスの内容でviewerを更新
    var val = elm.find('.editor input').val();
    elm.find('.viewer').text(val);

    var groupId = elm.closest('div.dragbox').attr('id').split('-')[1];
    var kmId = elm.parent().attr('id').split('-')[1];
    var km = {};
    km[columnName] = val;
    ajaxUpdateKeyMapping(groupId, kmId, km);
  };

  function ajaxUpdateKeyMapping (groupId, kmId, km) {
    var url = '/groups/' + groupId + '/key_mappings/' + kmId;
    var data = {'_method': 'put', 'key_mapping': km}
    ajaxWithJSON(url, data);
  };

  function ajaxDeleteKeyMapping (groupId, kmId, viewerText, editorText) {
    var url = '/groups/' + groupId + '/key_mappings/' + kmId;
    var data = {'_method': 'delete'};
    ajaxWithJSON(url, data);
  }
  
  function displayInputElm (elm) {
    var editor = elm.find('.editor');
    if (editor.css('display')=='none') {
      elm.find('div').toggle();
      var txtboxGroup = editor.find('input');
      txtboxGroup.focus();
      // カーソルをテキストボックスの最後に移動
      txtboxGroup.val(txtboxGroup.val()+"");
    }
  }

  //delete-keymapping
  $('.delete-keymapping').live('mouseover', function(){
    $(this).find('span').css({'display':'block', 'cursor':'pointer'});
  });

  $('.delete-keymapping').live('mouseout', function(){
    $(this).find('span').css({'display':'none', 'cursor':'default'});
  });

  $('.delete-keymapping').live('click', function(){
    var groupId = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var kmId = $(this).parent().attr('id').split('-')[1];
    
    // delete
    var removeElm = $(this).closest('tr');
    // edit
    var viewerElm = $(this).parent().find('.viewer');
    var editorElm = $(this).parent().find('.editor input');
    $('#delete-keymapping-msg').dialog({
      title: "確認",
      buttons: {
        'yes': function(event) {
          ajaxDeleteKeyMapping(groupId, kmId);
          removeElm.remove();
          $(this).dialog("close");
        },
        'no': function(event) {
          $(this).dialog("close");
        }
      }
    });
  });
});