class CreateSheets < ActiveRecord::Migration
  def change
    create_table :sheets do |t|
      t.string :name
      t.integer :max_column

      t.timestamps
    end
  end
end
