<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\APIController;

use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManager;
use Knp\Bundle\PaginatorBundle\Pagination\SlidingPagination;
use Knp\Bundle\PaginatorBundle\Twig\Extension\PaginationExtension;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use JMS\SecurityExtraBundle\Annotation\Secure;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
* @Rest\NamePrefix("api_")
*/
class ManagementController extends Controller{
    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getManagedEntitiesAction(Request $request){
        $entities = $this->container->getParameter('simple_admin.manage')['entities'];
        return $entities;
    }

    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getListingWindowAction(Request $request,$entityRepositoryName){

        /** @var EntityManager $em */
        $s = $this->get('simpleadmin.listener.serializationlistener');
        $em = $this->getDoctrine();
        $repository = $em->getRepository($entityRepositoryName);
        $qb = $repository->createQueryBuilder('a');
        $qb->orderBy('a.id');
        $query = $qb->getQuery();
        $paginator  = $this->get('knp_paginator');

        /** @var SlidingPagination $pagination */
        $pagination = $paginator->paginate(
            $query,
            $this->get('request')->query->get('page', 1),
            10
        );

        return $pagination->getItems();


    }

}