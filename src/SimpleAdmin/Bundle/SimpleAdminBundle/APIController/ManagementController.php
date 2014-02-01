<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\APIController;

use Doctrine\Bundle\DoctrineBundle\Registry;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\EntityManager;
use Doctrine\Common\Persistence\Mapping\ClassMetadata;
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

        /**
         * @var QueryBuilder $qb
         */
        $qb = $this->prepareQuery($entityRepositoryName,$request->query->get('filters',''));

        $query = $qb->getQuery();

        $paginator  = $this->get('knp_paginator');

        /** @var SlidingPagination $pagination */
        $pagination = $paginator->paginate(
            $query,
            $this->get('request')->query->get('page', 1),
            1
        );

        return array(
          "items"=>$pagination->getItems(),
          "total"=>$pagination->getTotalItemCount(),
          "pageSize"=>$pagination->getItemNumberPerPage(),
          "currentPage"=>$pagination->getCurrentPageNumber(),
          "totalPages"=> ceil($pagination->getTotalItemCount()/$pagination->getItemNumberPerPage()),
          "extra"=>"test"
        );

    }

    private function addFiltersToQuery(QueryBuilder $qb, ClassMetadata $meta, $filters){

      $filters = $this->getFiltersFromQueryString($filters);

      if(count($filters)){

        foreach($filters as $field => $value){

          $value = trim($value);

          if(in_array($field,$meta->getFieldNames())){

            $mapping = $meta->getFieldMapping($field);
            if($mapping['type'] == 'string' && !empty($value)){
              $qb->andWhere("a.".$field." LIKE :".$field."_value")->setParameter($field."_value","%".$value."%");
            }

          }

        }

      }

    }

    private function prepareQuery($entityRepositoryName, $filters){
      /** @var Registry $em */
      $em = $this->getDoctrine();
      $repository = $em->getRepository($entityRepositoryName);
      $meta = $em->getManager()->getClassMetadata($repository->getClassName());
      $mappings = $meta->getAssociationMappings();
      $qb = $repository->createQueryBuilder('a');
      $this->addFiltersToQuery($qb,$meta,$filters);
      $qb->orderBy('a.id');
      return $qb;
    }

  /**
   * @param string $filters Filters query string
   * @return array
   */
  private function getFiltersFromQueryString($filters){
      $output = array();
      parse_str($filters,$output);
      return $output;
    }

}