figma.showUI(__html__);

figma.ui.resize(500, 500);

figma.ui.onmessage = async(pluginMessage) => {
  await figma.loadAllPagesAsync();

  await figma.loadFontAsync({ family: "Rubik", style: "Regular" });

  const nodes:SceneNode[] = [];

  const postComponentSet = figma.root.findOne(node => node.type === "COMPONENT_SET" && node.name === "post") as ComponentSetNode;
  
  const variantsMap : Record<number, string> = {
    1: "none",
    2: "single",
    3: "carousel"
  };

  const imageVariantName = variantsMap[pluginMessage.imageVariant] || 1;
  const variantName = "Image=" + imageVariantName + ", Dark mode=" + pluginMessage.darkModeState
  const selectedVariant = postComponentSet.findOne(node => node.type === "COMPONENT" && node.name === variantName) as ComponentNode;

  const newPost = selectedVariant.createInstance();

  const templateName = newPost.findOne(node => node.name === "displayName" && node.type === "TEXT") as TextNode;
  const templateUsername = newPost.findOne(node => node.name === "@username" && node.type === "TEXT") as TextNode;
  const templateDescription = newPost.findOne(node => node.name === "description" && node.type === "TEXT") as TextNode;

  const numLikes = newPost.findOne(node => node.name === "likesLabel" && node.type === "TEXT") as TextNode;
  const numComments = newPost.findOne(node => node.name === "commentsLabel" && node.type === "TEXT") as TextNode;

  templateName.characters = pluginMessage.name;
  templateUsername.characters = pluginMessage.username;
  templateDescription.characters = pluginMessage.description;
  numLikes.characters = (Math.floor(Math.random() * 1000) +1).toString();
  numComments.characters = (Math.floor(Math.random() * 1000) +1).toString();

  nodes.push(newPost);

  figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
}

