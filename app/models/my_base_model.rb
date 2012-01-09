class MyBaseModel < ActiveRecord::Base
  self.abstract_class = true
  
  def self.next_ordinal
    ordinal = self.maximum(:ordinal) || 0
    ordinal += 1
  end
end