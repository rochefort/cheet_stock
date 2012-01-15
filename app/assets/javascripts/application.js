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
  $('td.key .editor input').keydown(function(e){
    if (e.keyCode == KEY_CODE_TAB) {
      var content = $(this).closest('tr').find('td.content');
      displayInputElm(content);
      return false;
    };
  });

  $('td.content .editor input').keydown(function(e){
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
  });

  function ajaxWithJSON (url, data, succ_func) {
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data:  data,
      success: succ_func
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
      var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
      var objSort = $(this).sortable('serialize');
      objSort['authenticity_token'] = $('#authenticity_token').val();
      var url = '/groups/' + group_id + '/key_mappings/reorder';
      ajaxWithJSON(url, objSort);
    }
  })
  .disableSelection();

  $('#add-group').click(function(){
    var succ_func = function(ajax){
      if (ajax.status === 'success') {
        $('.column').append(ajax.html);
        //TODO:focus
        $('.key-mapping table tbody').sortable('refresh');
      }
    };
    ajaxWithJSON('groups', '', succ_func);
  });

  $('.add-key-mapping').live('mouseover', function(){
    $(this).css('background', '#f0f0f0');
  });
  $('.add-key-mapping').live('mouseout', function(){
    $(this).css('background', '');
  });
  
  
  $('.add-key-mapping').live('click', function(){
    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var parent_elm = $(this).closest('div.dragbox').find('table');
    var url = '/groups/' + group_id + '/key_mappings/';
    var succ_func = function(ajax){
      if (ajax.status === 'success') {
        parent_elm.append(ajax.html);
        //TODO:focus
      }
    };
    ajaxWithJSON(url, '', succ_func);
  });

  $('h2').live('click', function(){
    displayInputElm($(this));
  });
  
  $('h2').live('blur', function(){
    var group_name = $(this).find('.editor input').val();
    $(this).find('.viewer').text(group_name);

    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var group = {'name': group_name};
    var url = '/groups/' + group_id;
    var data = {'_method': 'put', 'group': group};
    ajaxWithJSON(url, data);
    $(this).find('div').toggle();
  });

  $('.delete-group').live('click', function(){
    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    $('#delete-group-msg').dialog({
      title: "確認",
      buttons: {
        'yes': function(event) {
          var url = '/groups/' + group_id;
          var data = {'_method': 'delete'};
          var succ_func = function (ajax){ $('#group-' + group_id).remove();};
          ajaxWithJSON(url, data, succ_func);
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
  function updateKeyMapping (elm, column_name) {
    // テキストボックスの内容でviewerを更新
    var val = elm.find('.editor input').val();
    elm.find('.viewer').text(val);

    var group_id = elm.closest('div.dragbox').attr('id').split('-')[1];
    var km_id = elm.parent().attr('id').split('-')[1];    
    var km = {};
    km[column_name] = val;
    ajaxUpdateKeyMapping(group_id, km_id, km);
    elm.find('div').toggle();
  };
  
  $('td.key').live('blur', function(){
    updateKeyMapping($(this), 'key');
  });

  $('td.content').live('blur', function(){
    updateKeyMapping($(this), 'content');
  });

  function ajaxUpdateKeyMapping (group_id, km_id, km) {
    var url = '/groups/' + group_id + '/key_mappings/' + km_id;
    var data = {'_method': 'put', 'key_mapping': km}
    ajaxWithJSON(url, data);
  };

  function ajaxDeleteKeyMapping (group_id, km_id, viewer_text, editor_text) {
    var url = '/groups/' + group_id + '/key_mappings/' + km_id;
    var data = {'_method': 'delete'};
    ajaxWithJSON(url, data);
  }
  
  function displayInputElm (elm) {
    var editor = elm.find('.editor');
    if (editor.css('display')=='none') {
      elm.find('div').toggle();
      var txtbox_group = editor.find('input');
      txtbox_group.focus();
      // カーソルをテキストボックスの最後に移動
      txtbox_group.val(txtbox_group.val()+"");
    }
  }
  // function toggleElm(elm) {
  //   var editor = elm.find('.editor');
  //   elm.find('div').toggle();
  //   var txtbox_group = editor.find('input');
  //   txtbox_group.focus();
  //   // カーソルをテキストボックスの最後に移動
  //   txtbox_group.val(txtbox_group.val()+"");
  // };

  //delete-keymapping
  $('.delete-keymapping').live('mouseover', function(){
    $(this).find('span').css({'display':'block', 'cursor':'pointer'});
  });

  $('.delete-keymapping').live('mouseout', function(){
    $(this).find('span').css({'display':'none', 'cursor':'default'});
  });

  $('.delete-keymapping').live('click', function(){
    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var km_id = $(this).parent().attr('id').split('-')[1];
    
    // delete
    var remove_elm = $(this).closest('tr');
    // edit
    var viewer_elm = $(this).parent().find('.viewer');
    var editor_elm = $(this).parent().find('.editor input');
    $('#delete-keymapping-msg').dialog({
      title: "確認",
      buttons: {
        'yes': function(event) {
          ajaxDeleteKeyMapping(group_id, km_id);
          remove_elm.remove();
          $(this).dialog("close");
        },
        'no': function(event) {
          $(this).dialog("close");
        }
      }
    });
  });
});