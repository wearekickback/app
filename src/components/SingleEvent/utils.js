export function winningShare(deposit, registered, attended) {
  return ((deposit * registered) / attended).toFixed(3)
}

export function checkAdmin(party, address) {
  const admins = [...party.admins, party.owner]
  return admins.find(admin => admin.toLowerCase() === address.toLowerCase())
    ? true
    : false
}
