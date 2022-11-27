import {
  createStyles,
  Navbar,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { MdGames, MdArchive, MdSettings } from "react-icons/md";
import { IoMdDisc } from "react-icons/io";
import { Link } from "@tanstack/react-location";
import { IconType } from "react-icons";

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
  icon: IconType;
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
            <Icon size={24} />
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
        <NavbarLink icon={MdGames} label="Collection" to="/" />
        <NavbarLink icon={IoMdDisc} label="Installers" to="/paths" />
        <NavbarLink icon={MdArchive} label="Local" to="/local" />
      </Stack>
    </Navbar.Section>
    <Navbar.Section>
      <Stack justify="center" spacing={4}>
        <NavbarLink icon={MdSettings} label="Settings" to="/settings" />
      </Stack>
    </Navbar.Section>
  </Navbar>
);
