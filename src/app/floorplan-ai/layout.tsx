export const metadata = {
  title: "FloorPlan AI - Turn 2D Floor Plans Into Cinematic Real Estate Content",
  description: "Upload your 2D floor plan and let AI generate stunning 3D renderings and cinematic walkthrough videos in minutes.",
};

export default function FloorPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {children}
    </div>
  );
}
