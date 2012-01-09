module SheetsHelper

  def key_option(km)
    " nodata" if km.key.blank? and km.content.blank? 
  end
  
end
