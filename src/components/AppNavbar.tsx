import {
  createStyles,
  Navbar,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCategory,
  IconDeviceGamepad2,
  IconSettings,
  TablerIcon,
} from "@tabler/icons";
import { Link } from "@tanstack/react-location";

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
    opacity: 0.85,

    "&:hover": {
      opacity: 1,
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.1
      ),
    },
  },

  active: {
    opacity: 1,
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.15
      ),
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  to?: string;
}

const NavbarLink = ({ icon: Icon, label, to }: NavbarLinkProps) => {
  const { classes, cx } = useStyles();
  return (
    <Link to={to}>
      {({ isActive }) => (
        <Tooltip label={label} position="right">
          <UnstyledButton
            className={cx(classes.link, { [classes.active]: isActive })}
          >
            <Icon stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      )}
    </Link>
  );
};

export const AppNavbar = () => (
  <Navbar
    width={{ base: 80 }}
    p="md"
    sx={(theme) => ({
      alignItems: "center",
      backgroundColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
    })}
  >
    <Navbar.Section grow>
      <Stack justify="center" spacing={4}>
        <NavbarLink icon={IconDeviceGamepad2} label="Games" to="/" />
        <NavbarLink icon={IconCategory} label="Paths" to="/paths" />
      </Stack>
    </Navbar.Section>
    <Navbar.Section>
      <Stack justify="center" spacing={4}>
        <NavbarLink icon={IconSettings} label="Settings" to="/settings" />
      </Stack>
    </Navbar.Section>
  </Navbar>
);
