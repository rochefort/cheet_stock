class SheetsController < ApplicationController
  def index
    @sheet = Sheet.find(1) # TODO: userと絡める　& 諸々sheet controllerへ移動
    @groups = {}
    # column_no毎にグループ化
    groups = Group.order('groups.ordinal, key_mappings.ordinal').includes(:key_mappings)
    groups.chunk{|group| group.column_no }.each{ |k,v| @groups[k] = v }
  end
end
