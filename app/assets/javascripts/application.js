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
  $('.column').sortable({
    connectWith: '.column',
    handle: 'h2',
    cursor: 'move',
    placeholder: 'placeholder',
    forcePlaceholderSize: true,
    opacity: 0.4,
    update: function() {
      $.ajax({
        url: '/groups/reorder',
        type: 'POST',
        dataType: 'text',
        data: $(this).sortable('serialize') + '&authenticity_token=' + $('#authenticity_token').val()
      })
    }
  })
  .disableSelection();

  $('.key-mapping table tbody').sortable({
    connectWith: '.key-mapping table tbody',
    cursor: 'move',
    opacity: 0.4,
    update: function(event, ui) {
      var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];       
      $.ajax({
        url: '/groups/' + group_id + '/key_mappings/reorder',
        type: 'POST',
        dataType: 'text',
        data: $(this).sortable('serialize') + '&authenticity_token=' + $('#authenticity_token').val()
      })
    }
  })
  .disableSelection();

  $('#add-group').click(function(){
    $.ajax({
      url: '/groups',
      type: 'POST',
      dataType: 'json',
      success: function(ajax){
        if (ajax.status === 'success') {
          $('.column').append(ajax.html);
          //TODO:focus
          $('.key-mapping table tbody').sortable('refresh');
        };
      }
    });
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
    $.ajax({
      url: '/groups/' + group_id + '/key_mappings/',
      type: 'POST',
      dataType: 'json',
      success: function(ajax){
        if (ajax.status === 'success') {
          parent_elm.append(ajax.html);
          //TODO:focus
        };
      }
    });
  });

  $('h2').live('click', function(){
    toggleElm($(this));
  });
  
  $('h2').live('blur', function(){
    var group_name = $(this).find('.editor input').val();
    $(this).find('.viewer').text(group_name);

    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var group = {'name': group_name};
    $.ajax({
      url: '/groups/' + group_id,
      type: 'POST',
      dataType: 'json',
      data: {'_method': 'put', 'group': group}
    });
    $(this).find('div').toggle();
  });

  $('.delete-group').live('click', function(){
    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    $('#delete-group-msg').dialog({
      title: "確認",
      buttons: {
        'yes': function(event) {
          $.ajax({
            url: '/groups/' + group_id,
            type: 'POST',
            dataType: 'json',
            data: {'_method': 'delete'},
            success: function (ajax){
              $('#group-' + group_id).remove();
            }
          });
          $(this).dialog("close");
        },
        'no': function(event) {
          $(this).dialog("close");
        }
      }
    });
  });

  $('td.key').live('click', function(){
    toggleElm($(this));
  });

  $('td.content').live('click', function(){
    toggleElm($(this));
  });

  //TODO:抽象化
  $('td.key').live('blur', function(){
    var val = $(this).find('.editor input').val();
    $(this).find('.viewer').text(val);

    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var km_id = $(this).parent().attr('id').split('-')[1];
    var km = {'key': val};
    ajaxUpdateKeyMapping(group_id, km_id, km);
    $(this).find('div').toggle();
  });

  $('td.content').live('blur', function(){
    var val = $(this).find('.editor input').val();
    $(this).find('.viewer').text(val);

    var group_id = $(this).closest('div.dragbox').attr('id').split('-')[1];
    var km_id = $(this).parent().attr('id').split('-')[1];
    var km = {'content': val};
    ajaxUpdateKeyMapping(group_id, km_id, km);
    $(this).find('div').toggle();
  });

  function ajaxUpdateKeyMapping (group_id, km_id, km) {
    $.ajax({
      url: '/groups/' + group_id + '/key_mappings/' + km_id,
      type: 'POST',
      dataType: 'json',
      data: {'_method': 'put', 'key_mapping': km}
    });
  };

  // viewer_text.text('');
  // editor_text.val('');
  
  function ajaxDeleteKeyMapping (group_id, km_id, viewer_text, editor_text) {
    $.ajax({
      url: '/groups/' + group_id + '/key_mappings/' + km_id,
      type: 'POST',
      dataType: 'json',
      data: {'_method': 'delete'},
      success: function (){
      }
    });
  }
  
  function toggleElm(elm) {
    var editor = elm.find('.editor');
    elm.find('div').toggle();
    var txtbox_group = editor.find('input');
    txtbox_group.focus();
    // カーソルをテキストボックスの最後に移動
    txtbox_group.val(txtbox_group.val()+"");
  };

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

