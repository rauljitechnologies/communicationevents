/**
 * Shared footer line. The public site shows the copyright only; the admin
 * panel also carries the build credit.
 */
export const STUDIO = {
  name: "Raulji Technologies",
  url: "https://rauljitechnologies.com/",
};

export function CreditLine({
  className = "",
  credit = false,
}: {
  className?: string;
  /** Show "Design and developed by …". Admin panel only. */
  credit?: boolean;
}) {
  return (
    <div className={className}>
      <p>© {new Date().getFullYear()} Communication &amp; Events. All rights reserved.</p>
      {credit && (
        <p className="mt-1">
          Design and developed by{" "}
          <a
            href={STUDIO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            {STUDIO.name}
          </a>
        </p>
      )}
    </div>
  );
}
