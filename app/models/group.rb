class Group < MyBaseModel
  has_many :key_mappings, dependent: :destroy
  belongs_to :sheet
  default_scope order(['groups.column_no', 'groups.ordinal'])
end
