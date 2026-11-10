/**
 * tool-renderer.tsx – Tool name → card UI mapping
 * Maps each completed tool invocation from the assistant message to a rich
 * React card (projects, profile, résumé, contact, skills, internship), with a
 * generic pretty-printed result dump as the fallback for unknown tools.
 */
// src/components/chat/tool-renderer.tsx
import { Contact } from '../contact';
import InternshipCard from '../InternshipCard';
import { Presentation } from '../presentation';
import AllProjects from '../projects/AllProjects';
import Resume from '../resume';
import Skills from '../skills';

// Props come from SimplifiedChatView: completed tool calls + owning message id.
interface ToolRendererProps {
  toolInvocations: any[];
  messageId: string;
}

/**
 * Renders a list of completed tool invocations as rich cards.
 * @param toolInvocations – tool calls whose state is already "result"
 * @param messageId – id of the owning message (React key fallback)
 */
export default function ToolRenderer({
  toolInvocations,
  messageId,
}: ToolRendererProps) {
  return (
    <div className="w-full transition-all duration-300">
      {toolInvocations.map((tool) => {
        const { toolCallId, toolName } = tool;

        // Tool name → card UI mapping: every portfolio section has its own
        // server tool, so getProjects → AllProjects gallery,
        // getPresentation → hero intro, getResume → résumé card,
        // getContact → contact section, getSkills → skills matrix and
        // getInternship → profile/experience card.
        // Return specialized components based on tool name
        switch (toolName) {
          case 'getProjects':
            return (
              <div
                key={toolCallId}
                className="w-full overflow-hidden rounded-lg"
              >
                <AllProjects />
              </div>
            );

          case 'getPresentation':
            return (
              <div
                key={toolCallId}
                className="w-full overflow-hidden rounded-lg"
              >
                <Presentation />
              </div>
            );

          case 'getResume':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Resume />
              </div>
            );

          case 'getContact':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Contact />
              </div>
            );

          case 'getSkills':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Skills />
              </div>
            );

          case 'getInternship':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <InternshipCard />
              </div>
            );

          // Default renderer for other tools
          // Header shows the tool name plus the raw result — pretty-printed
          // JSON for objects, plain text otherwise.
          default:
            return (
              <div
                key={toolCallId}
                className="bg-secondary/10 w-full rounded-lg p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{toolName}</h3>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                    Tool Result
                  </span>
                </div>
                <div className="mt-2">
                  {typeof tool.result === 'object' ? (
                    <pre className="bg-secondary/20 overflow-x-auto rounded p-3 text-sm">
                      {JSON.stringify(tool.result, null, 2)}
                    </pre>
                  ) : (
                    <p>{String(tool.result)}</p>
                  )}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
