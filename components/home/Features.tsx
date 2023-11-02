import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from "i18next";
import Committee from '../../public/images/Committee.png'
import DAO from '../../public/images/DAO.png'
import { StaticImageData } from 'next/image';

interface CardProps {
  heading: string
  description: string
  imagePath: StaticImageData
  href: string
}



const Card = ({ heading, description, imagePath, href }: CardProps) => {
  const textColor = useColorModeValue('gray.500', 'gray.300'); 
  const headingColor = useColorModeValue('#3107DA', 'white');

  return (
<Box
  maxW={{ base: 'full', md: '450px' }}
  w="full"
  display="flex" 
  justifyContent="space-between" 
  borderRadius="lg"
  overflow="hidden"
  px={6}
  pt={6}
  pb={10}
  boxShadow='lg'
>
  <Stack align="start" spacing={2} width="70%">
    <Box mt={2}>
      <Heading size="md" py={2} color={headingColor}>{heading}</Heading>
      <Text mt={1} fontSize="sm" color={textColor}>
        {description}
      </Text>
    </Box>
  </Stack>
  <Flex
    width="30%"
    align="center"
    justify="center"
    maxH={110}
  >
    <Image src={imagePath.src} alt={heading} w="100%" h="100%" />
  </Flex>
</Box>
  )
}

export default function Features() {
	const { t } = useTranslation()

  const headingColor = useColorModeValue('#3107DA', 'white');
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mt={'10'}>
        <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'} color={headingColor}>
          {t('How Axia works')}
        </Heading>
      </Stack>

      <Container maxW={'5xl'} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <Card
            heading={'Launch a DAO'}
            imagePath={DAO}
            description={'Create value in your community, easily identify contributors, resolve disputes, and make the contribution way transparent'}
            href={'#'}
          />
          <Card
            heading={'Elect a Moderator Commitee'}
            imagePath={Committee}
            description={'All DAO members have equal voting power to choose the members of the moderator committee, who will resolve disputes and maintain harmony in the organization.'}
            href={'#'}
          />
        </Flex>
      </Container>
    </Box>
  )
}