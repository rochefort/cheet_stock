class KeyMapping < ActiveRecord::Base
  belongs_to :group
  
  attr_protected :group_id
end
