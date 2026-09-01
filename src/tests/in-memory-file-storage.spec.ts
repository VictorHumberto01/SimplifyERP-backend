import { InMemoryFileStorage } from "./in-memory-file-storage";

describe("In Memory File Storage", () => {
  it("uploads, generates a download reference and deletes a file", async () => {
    const storage = new InMemoryFileStorage();

    await storage.upload({ key: "docs/a.pdf", content: Buffer.from("conteúdo"), contentType: "application/pdf" });
    expect(storage.files.has("docs/a.pdf")).toBe(true);

    const url = await storage.getDownloadUrl("docs/a.pdf");
    expect(url).toContain("docs/a.pdf");

    await storage.delete("docs/a.pdf");
    expect(storage.files.has("docs/a.pdf")).toBe(false);
  });

  it("rejects generating a download URL for a file that doesn't exist", async () => {
    const storage = new InMemoryFileStorage();
    await expect(storage.getDownloadUrl("missing.pdf")).rejects.toThrow();
  });
});
