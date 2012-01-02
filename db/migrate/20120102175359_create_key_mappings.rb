class CreateKeyMappings < ActiveRecord::Migration
  def change
    create_table :key_mappings do |t|
      t.string :key
      t.string :content
      t.integer :ordinal

      t.timestamps
    end
  end
end
