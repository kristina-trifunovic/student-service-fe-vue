class User {
  constructor(
    accountNonExpired,
    accountNonLocked,
    address,
    authorities,
    city,
    credentialsNonExpired,
    firstName,
    lastName,
    password,
    username
  ) {
    this.accountNonExpired = accountNonExpired;
    this.accountNonLocked = accountNonLocked;
    this.address = address;
    this.authorities = authorities;
    this.city = city;
    this.credentialsNonExpired = credentialsNonExpired;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.username = username;
  }
}
