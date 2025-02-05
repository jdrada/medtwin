import { AllergyIntolerance } from "fhir/r4";

interface IAllergyDisplayProps {
  allergy: AllergyIntolerance[] | any[] | undefined;
}
const AllergyDisplay = ({ allergy }: IAllergyDisplayProps) => {
  if (!allergy) return null;

  return (
    <div>
      <h3 className="text-2xl font-bold">Allergies</h3>
      <table>
        <thead>
          <tr>
            <th className="text-left min-w-[200px]">Type</th>
            <th className="text-left min-w-[200px]">Manifestation</th>
            <th className="text-left min-w-[200px]">Severity</th>
          </tr>
        </thead>
        <tbody>
          <>
            {allergy.length === 0 && (
              <tr>
                <td colSpan={3}>No allergies found</td>
              </tr>
            )}
            {allergy.map((allergy) => (
              <tr key={allergy?.id}>
                <td>
                  {allergy?.resource?.code?.coding?.[0]?.display ||
                    allergy?.resource?.code?.text}
                </td>
                <td>
                  {
                    allergy?.resource?.reaction?.[0]?.manifestation?.[0]
                      ?.coding?.[0]?.display
                  }
                </td>
                <td>{allergy?.resource?.reaction?.[0]?.severity}</td>
              </tr>
            ))}
          </>
        </tbody>
      </table>
    </div>
  );
};

export default AllergyDisplay;
