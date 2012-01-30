class AddColumnNoToGroup < ActiveRecord::Migration
  def change
    add_column :groups, :column_no, :integer, default: 1
  end
end
