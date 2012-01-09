class KeyMapping < MyBaseModel
  belongs_to :group
  
  attr_protected :group_id
end
