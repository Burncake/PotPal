export function reloadScript(scriptUrl) {
  // Find the existing script by its src attribute
  const existingScript = document.querySelector(`script[src="${scriptUrl}"]`)

  // Remove the existing script if it exists
  if (existingScript) {
    existingScript.parentNode.removeChild(existingScript)
    console.log('Existing script removed')
  }

  // Create a new script element
  const script = document.createElement('script')
  script.src = scriptUrl
  script.type = 'text/javascript'
  script.defer = true // Ensure the script is executed after the HTML is parsed

  // Append the new script to the head
  document.head.appendChild(script)

  // Optional: Handle when the script is loaded
  script.onload = () => {
    console.log('Script reloaded successfully')
    // You can reinitialize any components or trigger actions after the script loads
  }
}
