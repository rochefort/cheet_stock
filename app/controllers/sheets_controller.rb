class SheetsController < ApplicationController
  def index
    @groups = Group.order('groups.ordinal, key_mappings.ordinal').includes(:key_mappings)
  end
end
