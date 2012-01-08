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
  
  $('#add-group').click(function(){
    $.ajax({
      url: '/groups',
      type: 'POST',
      dataType: 'json',
      success: function (ajax){
        var status = ajax.status;
        if (ajax.status == 'success') {
          $('.column').append(ajax.html);
          //TODO:focus
        };
      }
    });
  });

  $('h2').live('click', function(){
    var editor = $(this).find('.editor');
    $(this).find('div').toggle();
    var txtbox_group = editor.find('input');
    txtbox_group.focus();
    // カーソルをテキストボックスの最後に移動
    txtbox_group.val(txtbox_group.val()+"");
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
    $.ajax({
      url: '/groups/' + group_id,
      type: 'POST',
      dataType: 'json',
      data: {'_method': 'delete'},
      success: function (ajax){
        $('#group-' + group_id).remove();
      }
    });
  });
});

