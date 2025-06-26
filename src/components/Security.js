import { Box, Typography, Grid, Card, CardContent, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const securitySections = [
  {
    title: 'Infrastructure & Hosting',
    points: [
      'Newrole is hosted on industry-leading cloud infrastructure: Google Cloud Platform(GCP) known for its robust security and scalability.',
      'All data is stored in secure, access-controlled environments with multi-region backup strategies.',
      '24/7 monitoring and disaster recovery plans are in place to ensure business continuity.',
    ],
  },
  {
    title: 'Data Protection',
    points: [
      'We use AES-256 encryption for data at rest and TLS 1.2+ for data in transit.',
      'All sensitive information, including API tokens and user identifiers, is encrypted and access-controlled.',
      'Strict internal policies prevent unauthorized access to user data.',
    ],
  },
  {
    title: 'Reliability & Availability',
    points: [
      'Newrole is built for high availability with auto-scaling and failover support.',
      'Our uptime goal is 99.9%+, supported by advanced monitoring tools and alerting systems.',
      'Service Status is monitored and communicated proactively.',
    ],
  },
  {
    title: 'User Security',
    points: [
      'OAuth 2.0 is used for secure authentication with YouTube and Google services.',
      'We never store your YouTube password or access sensitive data without explicit consent.',
      'Multi-layered token validation protects against misuse or unauthorized access.',
    ],
  },
  {
    title: 'Access Controls & Compliance',
    points: [
      'We follow the principle of least privilege for internal access to systems and databases.',
      'Access is role-based and logged for transparency and accountability.',
      'Our system is designed with YouTube API Services and data security compliance in mind.',
    ],
  },
  {
    title: 'Responsible Disclosure',
    points: [
      'We encourage security researchers to responsibly disclose vulnerabilities.',
      'Report potential issues at security@newrole.in.',
      'All reports are investigated thoroughly and treated with the highest priority.',
    ],
  },
];

const Security = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Navbar />
      <Box sx={{ px: isMobile ? 3 : 10, py: 10, mt: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 3 }}>
          Security at Newrole
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 400, mb: 5, color: 'gray' }}>
          Your trust is our top priority. We're committed to protecting your data through enterprise-grade security
          practices, infrastructure integrity, and ongoing monitoring.
        </Typography>

        <Grid container spacing={4}>
          {securitySections.map((section, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card elevation={3} sx={{ height: '100%', borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {section.title}
                  </Typography>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {section.points.map((point, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem', color: '#333' }}>
                        <Typography variant="body1">{point}</Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default Security;
