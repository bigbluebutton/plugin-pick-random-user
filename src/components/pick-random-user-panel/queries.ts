// TODO: Replace this query with the useUsersBasicInfo once it's merged in
export const USERS_MORE_INFORMATION = `
subscription usersMoreInformation {
  user(where: { bot: { _eq: false } }) {
    color
    name
    userId
    role
    presenter
    bot
  }
}
`;
