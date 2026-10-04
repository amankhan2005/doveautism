import { useParams } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { CtaBand } from '../sections/CtaBand.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Container } from '../components/ui/Container.jsx';
import { teamMemberBySlug } from '../content/team.js';
import NotFound from './NotFound.jsx';

/** Team bio template. Unpublished or unknown members fall through to 404. */
export default function TeamMember() {
  const { slug } = useParams();
  const member = teamMemberBySlug(slug);
  useSeo(member ? 'about' : 'notFound');
  if (!member) return <NotFound />;

  return (
    <>
      <PageHero crumb={member.name} title={member.name} lead={member.role} />
      <Section>
        <Container size="prose" className="prose">
          {member.bio.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
