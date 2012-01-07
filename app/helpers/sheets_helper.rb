module SheetsHelper
  def set_km_class
    ' class="nodata"' if km.key.blank? and km.content.blank?
  end
end
