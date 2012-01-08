class Group < ActiveRecord::Base
  has_many :key_mappings, dependent: :destroy
  
  def self.next_ordinal
    ordinal = self.maximum(:ordinal) || 0
    ordinal += 1
  end
end
