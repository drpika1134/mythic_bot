$(document).ready(function() {
  // Display the DataTable
  $('.logs').DataTable()

  // Stores/remember the tab in localStorage when redirect
  $('a[data-toggle="tab"]').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
  })

  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    let id = $(e.target).attr('href')
    localStorage.setItem('selectedTab', id)
  })

  let selectedTab = localStorage.getItem('selectedTab')
  if (selectedTab != null) {
    $('a[data-toggle="tab"][href="' + selectedTab + '"]').tab('show')
  }
})
