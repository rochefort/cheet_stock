class Group < MyBaseModel
  has_many :key_mappings, dependent: :destroy
end
