import { put } from "@vercel/blob";

const MODEL_PLACEHOLDERS: Record<string, string> = {
  explorer: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  taster: "https://modelviewer.dev/shared-assets/models/Horse.glb",
  curator: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
  streaker: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
  "year-completionist": "https://modelviewer.dev/shared-assets/models/RocketShip.glb",
};

async function downloadAndUpload(url: string, filename: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  const blob = await put(filename, Buffer.from(buffer), {
    access: "public",
    contentType: "model/gltf-binary",
  });
  return blob.url;
}

async function main() {
  console.log("☁️ Subiendo modelos 3D a Vercel Blob...\n");
  
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN no configurado");
    process.exit(1);
  }

  try {
    for (const [id, url] of Object.entries(MODEL_PLACEHOLDERS)) {
      const filename = `badges/${id}.glb`;
      console.log(`📥 Descargando y subiendo ${id}...`);
      const blobUrl = await downloadAndUpload(url, filename);
      console.log(`   ✓ ${id}: ${blobUrl}`);
    }
    
    console.log("\n🎉 Modelos subidos exitosamente!");
    console.log("\n📝 Actualiza ARPreview.tsx BADGE_MODELS con estas URLs:");
    for (const [id] of Object.entries(MODEL_PLACEHOLDERS)) {
      console.log(`   ${id}: "https://<tu-store>.vercel-storage.com/badges/${id}.glb"`);
    }
    
  } catch (error) {
    console.error("❌ Error subiendo modelos:", error);
    process.exit(1);
  }
}

main();