import React from 'react';
import {
  Box,
  Typography,
  Link,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  SportsSoccer as SportsIcon,
  Info as InfoIcon,
  Policy as PolicyIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useLayout } from './MainLayout';

// ===== TYPES =====

export interface FooterProps {
  showSocial?: boolean;
  showLinks?: boolean;
  showCopyright?: boolean;
  variant?: 'minimal' | 'standard' | 'detailed';
  customContent?: React.ReactNode;
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

// ===== FOOTER LINK COMPONENT =====

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, external = false }) => (
  <Link
    href={href}
    color="inherit"
    underline="hover"
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    sx={{
      fontSize: '0.875rem',
      '&:hover': {
        color: 'primary.main',
      },
    }}
  >
    {children}
  </Link>
);

// ===== FOOTER COMPONENT =====

export const Footer: React.FC<FooterProps> = ({
  showSocial = true,
  showLinks = true,
  showCopyright = true,
  variant = 'standard',
  customContent,
}) => {
  const theme = useTheme();
  const { isMobile, compactMode } = useLayout();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = new Date().getFullYear();

  // Social media links
  const socialLinks = [
    { icon: GitHubIcon, href: 'https://github.com/knandurislalom/lnl-sports-monitoring', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: EmailIcon, href: 'mailto:contact@sportsmonitoring.com', label: 'Email' },
  ];

  // Footer navigation links
  const footerLinks = {
    product: [
      { label: 'Live Games', href: '/live' },
      { label: 'Schedules', href: '/schedule' },
      { label: 'Recent Games', href: '/recent' },
      { label: 'Teams', href: '/teams' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'System Status', href: '/status' },
      { label: 'API Docs', href: '/docs' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  // Render based on variant
  if (variant === 'minimal') {
    return (
      <Box
        sx={{
          py: compactMode ? 1 : 2,
          px: { xs: 2, md: 3 },
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
          }}
        >
          {showCopyright && (
            <Typography variant="caption" color="text.secondary">
              © {currentYear} Sports Monitoring. All rights reserved.
            </Typography>
          )}
          
          {showSocial && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.slice(0, 2).map(({ icon: Icon, href, label }) => (
                <Tooltip key={label} title={label}>
                  <IconButton
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  if (variant === 'detailed') {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          pt: 4,
          pb: 2,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
          {/* Main footer content */}
          <Grid container spacing={4}>
            {/* Brand section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SportsIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  Sports Monitoring
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your ultimate destination for live sports scores, schedules, and updates. 
                Stay connected with your favorite teams and never miss a game.
              </Typography>
              
              {showSocial && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <Tooltip key={label} title={label}>
                      <IconButton
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Links sections */}
            {showLinks && !isSmall && (
              <>
                <Grid item xs={6} md={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Product
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {footerLinks.product.map(({ label, href }) => (
                      <FooterLink key={label} href={href}>
                        {label}
                      </FooterLink>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Support
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {footerLinks.support.map(({ label, href }) => (
                      <FooterLink key={label} href={href}>
                        {label}
                      </FooterLink>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Stay Updated
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get the latest updates and notifications about your favorite teams and games.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <FooterLink href="/notifications">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <InfoIcon fontSize="small" />
                        Notifications
                      </Box>
                    </FooterLink>
                    <FooterLink href="/help">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HelpIcon fontSize="small" />
                        Help
                      </Box>
                    </FooterLink>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Bottom section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            {showCopyright && (
              <Typography variant="caption" color="text.secondary">
                © {currentYear} Sports Monitoring Platform. All rights reserved.
              </Typography>
            )}

            {showLinks && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                }}
              >
                {footerLinks.legal.map(({ label, href }) => (
                  <FooterLink key={label} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Standard variant
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        py: compactMode ? 2 : 3,
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Custom content */}
        {customContent && (
          <>
            {customContent}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        <Grid container spacing={3} alignItems="center">
          {/* Brand and description */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SportsIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                Sports Monitoring
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Real-time sports scores and updates for all your favorite teams and leagues.
            </Typography>
          </Grid>

          {/* Quick links and social */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Quick links */}
              {showLinks && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FooterLink href="/privacy">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PolicyIcon fontSize="small" />
                      Privacy
                    </Box>
                  </FooterLink>
                  <FooterLink href="/terms">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SecurityIcon fontSize="small" />
                      Terms
                    </Box>
                  </FooterLink>
                  <FooterLink href="/help">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HelpIcon fontSize="small" />
                      Help
                    </Box>
                  </FooterLink>
                </Box>
              )}

              {/* Social icons */}
              {showSocial && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.slice(0, 3).map(({ icon: Icon, href, label }) => (
                    <Tooltip key={label} title={label}>
                      <IconButton
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        {showCopyright && (
          <>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center' }}
            >
              © {currentYear} Sports Monitoring Platform. Built with ❤️ for sports fans.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Footer;