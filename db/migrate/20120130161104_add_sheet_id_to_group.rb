class AddSheetIdToGroup < ActiveRecord::Migration
  def change
    add_column :groups, :sheet_id, :integer
  end
end
