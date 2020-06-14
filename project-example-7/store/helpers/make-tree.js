export default function makeTree(clients, payload) {
  const { root, data } = payload;

  function getNode(node) {
    return {
      avatar: clients[node.uid] && clients[node.uid].avatar,
      automatonExpiredAt: node.automatonExpiredAt,
      instimeExpiredAt: node.instimeExpiredAt,
      instagram: node.instagram,
      isAutomatonPurchased: node.isAutomatonPurchased,
      isInstimePurchased: node.isInstimePurchased,
      packageName: node.packageName,
      referralCode: node.referralCode,
    };
  }

  function reformat(node) {
    if (!node.childs) {
      return getNode(node);
    }

    const childs = {};

    node.childs.forEach((child) => {
      childs[child] = reformat(data[child]);
    });

    return {
      ...getNode(node),
      childs,
    };
  }

  if (root && data) {
    return reformat(data[root]);
  }

  return {};
}
