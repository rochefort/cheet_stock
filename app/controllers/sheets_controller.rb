class SheetsController < ApplicationController
  def index
    @groups = Group.order('ordinal').includes(:key_mappings)
  end
end
